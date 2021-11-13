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

class ContractList {
  contracts: Student[] = [];

  addStudent(std: Student): void {
    this.contracts.push(std);
  }

  // todo
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
    this.isValid = false;
  }

  setStudent(std: Student) {
    this.fName = std.firstName.trim().toLowerCase();
    this.name = std.name.trim().toLowerCase();
    this.hours = std.hours;
  }

  setRowEntries(row: RowEntry) {
    this.rowEntries.push(row);
  }
}

function handleContractListInput(list: File) {
  const reader = new FileReader();
  try {
    reader.onload = (ev) => {
      let c: string[] = ev.target.result.toString()?.split('\r\n');
      for (let i = 1; i < c.length; i++) {
        if (c[i] != '') {
          let [firstName, name, hours] = c[i].split(';');
          contractList.addStudent(
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

const getPageText = async (pdf: Pdf, pageNo: number) => {
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

  const pageTextPromises = [];

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

async function parseTokenizedText(list: string[]): Promise<StundenZettel[]> {
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

      if (contractsUploaded) {
        // todo das klappt noch net
        let stdFromContract: Student | undefined = contractList.getStdByName(
          sz.name,
        );
        if (stdFromContract) {
          sz.setStudent(stdFromContract);
        }
      }
      return sz;
    }
  });
}

async function handleSZListInput(list: File[]) {
  let tokenizedTextList: string[] = await readSZFiles(list);
  console.log(tokenizedTextList);
  //   let szList: StundenZettel[] =
  stundenzettelList = await parseTokenizedText(tokenizedTextList).then(
    (parsedList) =>
      parsedList.sort((a: StundenZettel, b: StundenZettel) =>
        a?.name?.localeCompare(b?.name),
      ),
  );
  szListUploaded = true;
  console.log(stundenzettelList);
  //   stundenzettelList = szList;
}

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

type RowEntry = {
  day: number;
  start: string;
  end: string;
  sum: number;
};

/* ##########################
    G L O B A L S
############################# */

let contractList: ContractList = new ContractList();
let stundenzettelList: StundenZettel[] = [];

let contractsUploaded = false;
let szListUploaded = false;

document.addEventListener('DOMContentLoaded', () => {
  const szInput: HTMLInputElement = document.getElementById(
    'uploadInputSZ',
  ) as HTMLInputElement;
  const contractsInput: HTMLInputElement = document.getElementById(
    'uploadInputList',
  ) as HTMLInputElement;
  const validateBtn = document.getElementById('startValidationButton');

  szInput.addEventListener('change', async () => {
    if (szInput.files[0] !== undefined) {
      enableValidation();
      let temp =
        szInput.files.length < 1 ? [].concat(szInput.files)[0] : szInput.files;
      await handleSZListInput(temp).then(() => {
        /* todo validation */
        console.log(stundenzettelList);
        szListUploaded = true;
      });
    }
  });

  contractsInput.addEventListener('change', async () => {
    if (contractsInput.files[0] !== undefined) {
      enableValidation();
      await handleContractListInput(contractsInput.files[0]);
      contractsUploaded = true;
    }
  });

  validateBtn.addEventListener('click', async () => {
    const docList = szInput.files;
    await handleSZListInput([].concat(docList));
  });

  function enableValidation() {
    if (szListUploaded && contractsUploaded) {
      validateBtn.classList.remove('disabled');
      validateBtn.classList.toggle('blob');
    }
  }
});
