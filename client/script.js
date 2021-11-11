/*
const fs = require('fs');
const pdfParser = require('pdf-parse');

document.addEventListener('DOMContentLoaded', () => {
    console.log('works')
    const input = document.getElementById('uploadInput');
    input.addEventListener('change', filesUpload);

    document.getElementById('startValidationButton')
        .addEventListener('click', readPdfFile);
})

let files = [];

function filesUpload() {
    let temp = (event.target).files;
    files.push(temp[0]);
    console.log(files);
}

function readPdfFile() {
    pdfParser(files[0]).then(e => files[0] = e)
    console.log(files[0].text)
}
*/
// wannabe month js enum
const m = {
  1: 'Januar',
  2: 'Februar',
  3: 'März',
  4: 'April',
  5: 'Mai',
  6: 'Juni',
  7: 'Juli',
  8: 'August',
  9: 'September',
  10: 'Oktober',
  11: 'November',
  12: 'Dezember',
};
Object.freeze(m);

// set of json.stringify object of students with their target hours
let contractSet = new Set();
let szList = [];

let valFlag1 = false;
let valFlag2 = false;

document.addEventListener('DOMContentLoaded', () => {
  const szInput = document.getElementById('uploadInputSZ');
  const contractsInput = document.getElementById('uploadInputList');
  const validateBtn = document.getElementById('startValidationButton');

  szInput.addEventListener('change', () => {
    if (szInput.files[0] !== undefined) {
      valFlag1 = true;
      enableValidation();
    }
  });
  contractsInput.addEventListener('change', async () => {
    if (contractsInput.files[0] !== undefined) {
      valFlag2 = true;
      enableValidation();
      const contractList = contractsInput.files;
      await readContractList(contractList);
    }
  });

  validateBtn.addEventListener('click', async () => {
    const docList = szInput.files;

    await readSZFiles(docList);
  });

  function enableValidation() {
    if (valFlag1 && valFlag2) {
      validateBtn.classList.remove('disabled');
      validateBtn.classList.toggle('blob');
    }
  }
});

async function readContractList(cList) {
  const reader = new FileReader();
  try {
    reader.onload = function (event) {
      createContractList(event.target.result);
    };
    reader.readAsText(cList[0]);
  } catch (e) {
    console.log(e);
  }
}

async function createContractList(cListString) {
  let cList = cListString.split(`\r\n`);
  const header = cList[0];

  for (let i = 1; i < cList.length; i++) {
    if (cList[i] !== '') {
      let [firstName, name, hours] = cList[i].split(';');
      let student = { firstName, name, hours };
      contractSet.add(JSON.stringify(student));
    }
  }
}

async function readSZFiles(docList) {
  console.log('______________________');
  console.log('start reading file(s)');
  console.log('______________________');

  let pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    '//mozilla.github.io/pdf.js/build/pdf.worker.js';

  for (let i = 0; i < docList.length; i++) {
    const doc = docList[i];
    let temp = doc.arrayBuffer();

    try {
      let worker = pdfjsLib.getDocument({ data: await temp });
      worker.promise.then((pdf) => {
        let pageNumber = 1;
        pdf.getPage(pageNumber).then(async function (page) {
          let tokenizedText = await page.getTextContent();
          await prepareValidation(i, tokenizedText.items);
          // const pageText = tokenizedText.items.map(token => token.str).join("");
          // console.log(pageText);
        });
      });
    } catch (e) {
      console.log(e);
    }
  }
}

// -- creates a "Stundenzettel" object by given tokens
async function prepareValidation(index, itemArr) {
  console.log('______________________');
  console.log('preparing Validation of file(s)');

  // -- stundenzettel object
  let sz = {
    lName: '',
    fName: '',
    bDate: '',
    month: '',
    fBereich: '',
    isSigned: false,
    gesamtstunden: 0,
    isValid: true,
  };
  // -- cleanup tokenArray for further work
  let arr = itemArr.map((item) => item.str.trim());
  arr = arr.filter((item) => item.trim() !== '');

  // -- extract header and save values in sz object attributes for validation
  let header = arr.slice(0, 10);
  sz.lName = header[1];
  sz.fName = header[5];
  sz.bDate = header[9];
  sz.month = header[3];
  sz.fBereich = header[7];

  // -- extract table and extract rowArrayEntries from it for validation
  let endOfTable = arr.indexOf('Gesamtstunden:');
  let table = arr.slice(14, endOfTable);
  let rowEntriesArray = [];
  for (let i = 0; i < table.length; i++) {
    if (table[i].indexOf(':') !== -1) {
      let sum = table[i + 2];
      let mid = sum.indexOf(':');
      const hours = +sum.slice(0, mid);
      let minutes = +sum.slice(mid + 1, sum.length + 1);
      minutes = minutes / 60;
      sum = hours + minutes;
      rowEntriesArray.push({
        day: table[i - 1],
        start: table[i],
        end: table[i + 1],
        sum: sum,
      });

      i = i + 2;
    }
  }
  sz.gesamtstunden = +arr[endOfTable + 1].slice(
    0,
    arr[endOfTable + 1].indexOf(':'),
  );

  console.log('bruuuuuu');
  console.log(rowEntriesArray)
  await validation(index, rowEntriesArray, sz);
}

async function validation(index, rowEntriesArray, szObject) {
  console.log('______________________');
  console.log('starting Validation of file(s)');

  let hLib = window.holiday;
  hLib.setState('he');

  // validation holidays
  for (let i = 0; i < rowEntriesArray.length; i++) {
    if (
      hLib.isHoliday(
        new Date(
          new Date().getFullYear(),
          szObject.month,
          rowEntriesArray[i].day,
        ),
      )
    ) {
      szObject.isValid = false;
      console.error(
        `Einer der Einträge scheint an einem Feiertag gewesen zu sein \n Tag: ${rowEntriesArray[i].day}, ${szObject.month} | ${rowEntriesArray[i].start} - ${rowEntriesArray[i].end} - ${rowEntriesArray[i].sum}`,
      );
    }
  }

  // validation workHours = sum of worked hours
  let sumOfWorkHours = 0;
  rowEntriesArray.map((entry) => (sumOfWorkHours += +entry.sum));
  if (sumOfWorkHours !== szObject.gesamtstunden) {
    szObject.isValid = false;
    console.error(
      `Die Summe der einzelnen Einträge stimmt nicht mit den Gesamtstunden überein`,
    );
  }

  // comparison with contracted target hours
  contractSet.forEach((cont) => {
    let cObject = JSON.parse(cont);
    if (szObject.lName === cObject.name) {
      if (szObject.gesamtstunden.toString() !== cObject.hours.toString()) {
        szObject.isValid = false;
        console.error(
          `Die Anzahl der Gesamtstunden stimmt nicht mit den vertraglich vereinbarten Stunden überein \n Gesamtstunden: ${szObject.gesamtstunden}, Sollstunden: ${cObject.hours}`,
        );
      }
    }
  });

  console.log('____________ R E S U L T _____________');
  console.log(
    `pdf: ${index}, month: ${szObject.month}, isValid: ${szObject.isValid}`,
  );

  display(szObject);
}

function display(szObject) {
  let table = document.getElementById('table');
  let tBody = document.getElementById('tBody');
  let tHead = table.createTHead();
  if (tHead.rows.length === 0) {
    // fill table head
    let tHeadRow = tHead.insertRow(0);
    for (let i = 0; i < Object.keys(szObject).length; i++) {
      let cell = tHeadRow.insertCell();
      cell.innerHTML = Object.keys(szObject)[i];
    }
  }

  // create row to insert data
  let tr = tBody.appendChild(document.createElement('TR'));
  // insert data
  for (let i = 0; i < Object.keys(szObject).length; i++) {
    let td = tr.appendChild(document.createElement('TD'));
    let content = document.createTextNode(
      Object.entries(szObject)[i][1].toString(),
    );
    td.appendChild(content);
  }
}
