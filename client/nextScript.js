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

async function readFile() {
    console.log('______________________');
    console.log('start reading file(s)');
    console.log('______________________');


    let pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

    const docList = document.getElementById('uploadInput').files;

    for (let i = 0; i < docList.length; i++) {
        const doc = docList[i];
        let temp = doc.arrayBuffer();
        // console.log(await temp);

        try {
            let worker = pdfjsLib.getDocument({data: await temp});
            worker.promise.then((pdf) => {
                console.log('pdf');
                // console.log(pdf);
                let pageNumber = 1;
                pdf.getPage(pageNumber).then(async function (page) {
                    // console.log('Page loaded');
                    // console.log(page);
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
    console.log('______________________');

    // -- stundenzettel object
    let sz = {
        lName: '',
        fName: '',
        bDate: '',
        month: '',
        fBereich: '',
        isSigned: false,
        gesamtstunden: 0,
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
    console.log(table);
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

    // -- sum up all worked hours from rowArrayEntries array for validation
    let sumOfWorkHours = 0;
    rowEntriesArray.map((ent) => sumOfWorkHours += +ent.sum)

    // -- log results
    console.log('____________ R E S U L T _____________');
    console.log('PDF: ' + index);
    console.log(sumOfWorkHours);
    sz.gesamtstunden = +(arr[endOfTable + 1].slice(0, arr[endOfTable + 1].indexOf(':')))
    let fakeValidation = sumOfWorkHours === sz.gesamtstunden;
    console.log('Correct: ' + fakeValidation);
    console.log('--------------------------------------')
    console.log(rowEntriesArray)

    await validation(index, sumOfWorkHours, rowEntriesArray, sz);
}

async function validation(index, sumOfWorkHours, rowEntriesArray, szObject) {
    console.log('______________________');
    console.log('starting Validation of file(s)');
    console.log('______________________');
    let hLib = window.holiday;
    hLib.setState('he');
    console.log(hLib.holidays);

    for (let i = 0; i < rowEntriesArray.length; i++) {
        if (hLib.isHoliday(new Date(2021, szObject.month, rowEntriesArray[i].day))) {
            alert('an freien tag wird idde gschafft!')
        }
    }

    console.log(hLib.isHoliday(new Date(2015, 0, 1)));
    console.log(`pdf: ${index}, month: ${szObject.month}`)
}

function display() {

}