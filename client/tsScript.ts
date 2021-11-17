/* ##########################
    T Y P E S
############################# */

// pdfjs stuff

declare module 'pdfjs-dist';

type TokenText = {
  str: string;
};

type PageText = {
  items: TokenText[];
};

type PdfPage = {
  getTextContent: () => Promise<PageText>;
};

type Pdf = {
  numPages: number;
  getPage: (pageNo: number) => Promise<PdfPage>;
};

type PDFSource = Buffer | string;

declare module 'pdfjs-dist/build/pdf.worker.js'; // needed in 2.3.0

// other types

type HolidayLibrary = {
  resetHoliday: () => void;
  setState: (bundesland: string) => void;
  isHoliday: (Date: Date) => boolean;
  isWorkday: (Date: Date) => boolean;
};

type RowEntry = {
  day: number;
  start: string;
  end: string;
  sum: number;
};

enum months {
  'January',
  'Februar',
  'März',
  'April',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
}

class Student {
  firstName: string;
  name: string;
  hours: number;

  constructor(fname, name, hr) {
    this.firstName = fname.trim().toLowerCase();
    this.name = name.trim().toLowerCase();
    this.hours = hr;
  }
}

class ContractsList {
  contracts: Student[] = [];

  addStudent(std: Student): void {
    this.contracts.push(std);
  }

  getStdByName(name: string): Student {
    for (let c of this.contracts) {
      if (name == c.name) {
        return c;
      }
    }
  }
}

class StundenZettel {
  fName: string;
  name: string;
  hours: number;
  bDate: string;
  month: string;
  fBereich: string;
  rowEntries: RowEntry[];
  gesamtstunden: number;
  isSigned: boolean;
  isValid: boolean;
  issues?: string[];

  constructor(
    fn: string,
    ln: string,
    bDate: string,
    month: string,
    fBereich: string,
  ) {
    this.fName = fn.trim().toLowerCase();
    this.name = ln.trim().toLowerCase();
    this.bDate = bDate;
    this.fBereich = fBereich;
    this.month = month;
    this.rowEntries = [];
    this.gesamtstunden = -1;
    this.isSigned = false;
    this.isValid = true;
  }

  setStudentData(std: Student) {
    this.fName = std.firstName.trim().toLowerCase();
    this.name = std.name.trim().toLowerCase();
    this.hours = std.hours;
  }

  setRowEntries(row: RowEntry) {
    this.rowEntries.push(row);
  }

  addIssue(issue: string) {
    if (!this.issues || this.issues.length < 1) {
      this.issues = [];
    }
    this.issues.push(issue);
    this.isValid = false;
  }
}

/* ##########################
    G L O B A L S
############################# */

let ContractList: ContractsList = new ContractsList();
let StundenzettelList: StundenZettel[] = [];

let holidayLibrary: HolidayLibrary;

// #######################################

function handleContractListInput(list: File) {
  const reader = new FileReader();
  try {
    reader.onload = (ev) => {
      let c: string[] = ev.target.result.toString()?.split('\r\n');
      for (let i = 1; i < c.length; i++) {
        if (c[i] != '') {
          let [firstName, name, hours] = c[i].split(';');
          ContractList.addStudent(
            new Student(
              firstName.trim().toLowerCase(),
              name.trim().toLowerCase(),
              hours.trim().toLowerCase(),
            ),
          );
        }
      }
    };
    reader.readAsText(list);
  } catch (e) {
    console.error(e);
  }
}

const getPageText = async (pdf: Pdf, pageNo: number): Promise<string[]> => {
  const page = await pdf.getPage(pageNo);
  const tokenizedText = await page.getTextContent();
  let pageText = tokenizedText.items.map((token) => token.str.trim());
  pageText = pageText.filter((token) => token.trim() !== '');
  return pageText;
};

async function readSZFiles(list: File[]) {
  let pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    '//mozilla.github.io/pdf.js/build/pdf.worker.js';

  const pageTextPromises: Promise<string[]>[] = [];

  for (let sz of list) {
    let data: ArrayBuffer = await sz.arrayBuffer();

    try {
      const pdf: Pdf = await pdfjsLib.getDocument({ data }).promise;
      const maxPages = pdf.numPages;
      for (let pageNo = 1; pageNo <= maxPages; pageNo++) {
        pageTextPromises.push(getPageText(pdf, pageNo));
      }
    } catch (e) {
      console.error(e);
    }
  }
  return await Promise.all(pageTextPromises);
}

async function parseTokenizedText(list: string[][]): Promise<StundenZettel[]> {
  return list.map((tokenList) => {
    if (tokenList.length > 0) {
      let header = tokenList.slice(0, 10);
      let sz: StundenZettel = new StundenZettel(
        header[5], // firstName
        header[1], // lastName
        header[9], // bDate
        header[3], // month
        header[7], // fBereich
      );
      let endOfTable = tokenList.indexOf('Gesamtstunden:');
      let table = tokenList.slice(14, endOfTable);

      for (let i = 0; i < table.length; i += 2) {
        if (table[i].indexOf(':') !== -1) {
          let rowSum = table[i + 2];
          let mid = rowSum?.indexOf(':');
          const hours: number = +rowSum?.slice(0, mid);
          let minutes: number = +rowSum?.slice(mid + 1, rowSum.length + 1);
          minutes = minutes / 60;

          sz.setRowEntries({
            day: +table[i - 1],
            start: table[i],
            end: table[i + 1],
            sum: hours + minutes,
          });
        }
      }
      sz.gesamtstunden = tokenList.length
        ? +tokenList[endOfTable + 1].slice(
            0,
            tokenList[endOfTable + 1].indexOf(':'),
          )
        : -2;

      if (ContractList.contracts.length > 0) {
        // todo das klappt noch net
        let stdFromContract: Student | undefined = ContractList.getStdByName(
          sz.name,
        );
        if (stdFromContract) {
          sz.setStudentData(stdFromContract);
        }
      }
      return sz;
    }
  });
}

async function handleSZListInput(list: File[]) {
  let tokenizedTextList: string[][] = await readSZFiles(list);
  //   console.log(tokenizedTextList);

  StundenzettelList = await parseTokenizedText(tokenizedTextList).then(
    (parsedList) =>
      parsedList.sort((a: StundenZettel, b: StundenZettel) =>
        a?.name?.localeCompare(b?.name),
      ),
  );
}

async function handleValidation() {
  let validationPromises: Promise<void>[] = [];

  try {
    for (const sz of StundenzettelList) {
      validationPromises.push(validate(sz));
    }
  } catch (err) {
    // todo
  }
  return await Promise.all(validationPromises);
}

async function validate(sz: StundenZettel) {
  try {
    // check for workday == holiday
    for (const entry of sz.rowEntries) {
      let workedDay = new Date(new Date().getFullYear(), +sz.month, entry.day);
      if (holidayLibrary.isHoliday(workedDay)) {
        sz.addIssue(
          `Einer der Einträge scheint an einem Feiertag gewesen zu sein. \n
           Tag: ${entry.day}, ${sz.month} | ${entry.start} - ${entry.end} - ${entry.sum}`,
        );
      }
    }
  } catch (error) {
    console.log(error);
  }

  try {
    // validation workHours = sum of worked hours
    let sumOfWorkHours = 0;
    sz.rowEntries.map((entry) => (sumOfWorkHours += +entry.sum));
    if (sumOfWorkHours !== sz.gesamtstunden) {
      sz.addIssue(
        `Die Summe der einzelnen Einträge stimmt nicht mit den Gesamtstunden überein.`,
      );
    }
  } catch (error) {
    console.log(error);
  }

  try {
    // comparison workHours and contracted hours
    if (sz.hours != sz.gesamtstunden) {
      let issueMsg: string =
        'Diesen Monat hat die Person zu ' +
        (sz.hours > sz.gesamtstunden ? 'viel' : 'wenig') +
        ' gearbeitet.';
      sz.addIssue(issueMsg);
    }
  } catch (error) {
    console.log(error);
  }
}

function renderResultTable() {
  let table: HTMLTableElement = document.getElementById(
    'table',
  ) as HTMLTableElement;
  let tBody = document.getElementById('tBody');
  const tHead = table.createTHead();
  const tableHeadColNames = ['Fist Name', 'Name', 'Month', 'Valid'];

  // todo sz object keys are a little more now than needed
  for (const sz of StundenzettelList) {
    try {
      if (tHead.rows.length === 0) {
        // fill table head
        let tHeadRow = tHead.insertRow(0);
        for (let i = 0; i < tableHeadColNames.length; i++) {
          let cell = tHeadRow.insertCell();
          cell.innerHTML = tableHeadColNames[i];
        }
      }
    } catch (error) {
      console.log(error);
    }

    try {
      let fName = sz.fName;
      let name = sz.name;
      let month = sz.month;
      let isValid = sz.isValid;
      let rowData = [fName, name, month, isValid];

      // create row to insert data
      let tr = tBody.appendChild(document.createElement('TR'));
      // insert data
      for (let i = 0; i < rowData.length; i++) {
        let td = tr.appendChild(document.createElement('TD'));
        let content = document.createTextNode(rowData[i].toString());
        td.appendChild(content);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const szInput: HTMLInputElement = document.getElementById(
    'uploadInputSZ',
  ) as HTMLInputElement;
  const contractsInput: HTMLInputElement = document.getElementById(
    'uploadInputList',
  ) as HTMLInputElement;
  const validateBtn = document.getElementById('startValidationButton');

  holidayLibrary = globalThis.holiday;
  holidayLibrary.setState('he');

  szInput.addEventListener('change', async () => {
    if (szInput.files[0] !== undefined) {
      let temp =
        szInput.files.length < 1 ? [].concat(szInput.files)[0] : szInput.files;

      await handleSZListInput(temp).then(() => {
        console.log(StundenzettelList);
        enableValidation();
      });
    }
  });

  contractsInput.addEventListener('change', async () => {
    if (contractsInput.files[0] !== undefined) {
      await handleContractListInput(contractsInput.files[0]);
      szInput.disabled = false;
      enableValidation();
    }
  });

  validateBtn.addEventListener('click', async () => {
    await handleValidation().then(() => {
      renderResultTable();
    });
  });

  function enableValidation() {
    let contractsUploaded = ContractList.contracts.length > 0;
    let szListUploaded = StundenzettelList.length > 0;

    if (szListUploaded && contractsUploaded) {
      validateBtn.classList.remove('disabled');
      validateBtn.classList.toggle('blob');
    }
  }
});

// todo
/*
  aktuell werden die sollstunden in stundenzettel.hours gespeichert
  -> in zukunft diese im Student speichern und dem Student einen Stundenzettel[]
  => validierung und rendern pro Student mölich
  => logischerer und angenehmerer aufbau
*/
