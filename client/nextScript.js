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
