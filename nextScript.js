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
}
Object.freeze(m);

// set of json.stringify object of students with their target hours
let c = new Set();

let valFlag1 = false;
let valFlag2 = false;

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('uploadInputSZ').addEventListener('change', () => {
        if (document.getElementById('uploadInputSZ').files[0] !== undefined) {
            valFlag1 = true;
            enableValidation()
        }
    })
    document.getElementById('uploadInputList').addEventListener('change', () => {
        if (document.getElementById('uploadInputList').files[0] !== undefined) {
            valFlag2 = true;
            enableValidation()
        }
    })

    function enableValidation() {
        if (valFlag1 && valFlag2) {
            console.log(document.getElementById('startValidationButton').classList);
            document.getElementById('startValidationButton').classList.remove('disabled')
            document.getElementById('startValidationButton').classList.toggle('blob')
        }
    }

})

async function validationEventHandle() {
    const docList = document.getElementById('uploadInputSZ').files;
    const contractList = document.getElementById('uploadInputList').files;

    await readContractList(contractList);
    await readSZFiles(docList);
}

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
            let temp = cList[i].split(',')
            let student = {firstName: temp[0], name: temp[1], hours: temp[2]}
            c.add(JSON.stringify(student));
        }
    }
}

async function readSZFiles(docList) {
    console.log('______________________');
    console.log('start reading file(s)');
    console.log('______________________');

    let pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';


    for (let i = 0; i < docList.length; i++) {
        const doc = docList[i];
        let temp = doc.arrayBuffer();

        try {
            let worker = pdfjsLib.getDocument({data: await temp});
            worker.promise.then((pdf) => {
                let pageNumber = 1;
                pdf.getPage(pageNumber).then(async function (page) {
                    let tokenizedText = await page.getTextContent();
                    await prepareValidation(i, tokenizedText.items);
                    // const pageText = tokenizedText.items.map(token => token.str).join("");
                    // console.log(pageText);
                })
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
    }
    // -- cleanup tokenArray for further work
    let arr = itemArr.map(item => item.str.trim())
    arr = arr.filter(item => item.trim() !== '');

    // -- extract header and save values in sz object attributes for validation
    let header = arr.slice(0, 10);
    sz.lName = header[1];
    sz.fName = header[5];
    sz.bDate = header[9];
    sz.month = header[3];
    sz.fBereich = header[7];

    // -- extract table and extract rowArrayEntries from it for validation
    let endOfTable = arr.indexOf('Gesamtstunden:')
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
            rowEntriesArray.push({day: table[i - 1], start: table[i], end: table[i + 1], sum: sum})

            i = i + 2;
        }
    }
    sz.gesamtstunden = +(arr[endOfTable + 1].slice(0, arr[endOfTable + 1].indexOf(':')))

    await validation(index, rowEntriesArray, sz);
    await display(sz);
}

async function validation(index, rowEntriesArray, szObject) {
    console.log('______________________');
    console.log('starting Validation of file(s)');
    try {
        let hLib = window.holiday;
        hLib.setState('he');

        // validate last name
        try {
            c.forEach((tutor) => {
                tutor = JSON.parse(tutor)
                console.log(tutor);
                if (tutor.name.toLowerCase() === szObject.lName.toLowerCase()) {
                    szObject.isValid = true;
                } else {
                    console.error(`Es konnte kein Eintrag zu Herr/Frau ${szObject.lName} in der Vertragsliste gefunden werden`);
                    szObject.isValid = false;
                    throw new Error('ValidationFail')
                }
            });
        } catch (ex) {
            return  ex
        }


        // validation holidays
        try {
            for (let i = 0; i < rowEntriesArray.length; i++) {
                if (hLib.isHoliday(new Date(new Date().getFullYear(), szObject.month, rowEntriesArray[i].day))) {
                    szObject.isValid = false;
                    console.error(`Einer der Einträge scheint an einem Feiertag gewesen zu sein \n Tag: ${rowEntriesArray[i].day}, ${szObject.month} | ${rowEntriesArray[i].start} - ${rowEntriesArray[i].end} - ${rowEntriesArray[i].sum}`)
                    throw new Error('ValidationFail')
                }
            }
        } catch (ex) {
            return ex
        }

        // validation workHours = sum of worked hours
        try {
            let sumOfWorkHours = 0;
            rowEntriesArray.map((entry) => sumOfWorkHours += +entry.sum)
            if (sumOfWorkHours !== szObject.gesamtstunden) {
                szObject.isValid = false;
                console.error(`Die Summe der einzelnen Einträge stimmt nicht mit den Gesamtstunden überein`)
                throw new Error('ValidationFail')
            }
        } catch (ex) {
            return ex
        }


        // comparison with contracted target hours
        try {
            c.forEach((cont) => {
                let cObject = JSON.parse(cont);
                if (szObject.lName === cObject.name) {
                    if (szObject.gesamtstunden.toString() !== cObject.hours.toString()) {
                        szObject.isValid = false;
                        console.error(`Die Anzahl der Gesamtstunden stimmt nicht mit den vertraglich vereinbarten Stunden überein \n Gesamtstunden: ${szObject.gesamtstunden}, Sollstunden: ${cObject.hours}`)
                        throw new Error('ValidationFail')
                    }
                }
            });
        } catch (ex) {
            return ex
        }


        console.log('____________ R E S U L T _____________');
        console.log(`pdf: ${index}, month: ${szObject.month}, isValid: ${szObject.isValid}`);
    } catch (e) {
        console.error(e)
    }


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
        let content = document.createTextNode(Object.entries(szObject)[i][1].toString());
        td.appendChild(content);
    }
}
