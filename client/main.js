"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var PDFReader = require("../node_modules/pdf2json");
var pdfParser = new PDFReader();
var fileArr = [];
document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById('uploadInput');
    input.addEventListener('change', filesUpload);
    document.getElementById('startValidationButton')
        .addEventListener('click', function (event) {
        showMeTheName();
    });
    document.getElementById('tryy')
        .addEventListener('click', function () {
        tryy2();
    });
});
function showMeTheName() {
    var name = fileArr[0].name.split(', ')[0];
    var lastName = fileArr[0].name.split(', ')[1].split('_')[0];
    console.log('this could already work');
    console.log(name, lastName);
    pdfParser.on("pdfParser_dataReady", function (pdfData) {
        console.log(JSON.stringify(pdfData));
    });
    pdfParser.loadPDF(fileArr[0]);
}
function trrrrryy() {
    var reader = new FileReader();
    reader.onload = function (ev) {
        var result = String(ev.target.result);
        console.log(result);
    };
    reader.readAsBinaryString(fileArr[0]);
}
function filesUpload() {
    var temp = event.target.files;
    fileArr.push(temp[0]);
    console.log(fileArr);
}
function tryy2() {
    pdfParser.on("pdfParser_dataError", function (errData) { return console.error(errData.parserError); });
    pdfParser.on("pdfParser_dataReady", function (pdfData) {
        fs.writeFile(path.join(__dirname, '../resources/Hilbert, Merlin_2097069_assignsubmission_file_Hilbert_Merlin_2020_12_06.pdf'), JSON.stringify(pdfData), function (d) {
            console.log(d);
        });
    });
    pdfParser.loadPDF("./pdf2json/test/pdf/fd/form/F1040EZ.pdf");
}
//# sourceMappingURL=main.js.map