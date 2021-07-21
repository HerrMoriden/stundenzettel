"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as PDFReader  from '../node_modules/pdf2json'
var bundle_js_1 = require("./bundle.js");
// let pdfParser = new PDFReader();
var fileArr = [];
document.addEventListener("DOMContentLoaded", function () {
    var input = document.getElementById('uploadInput');
    input.addEventListener('change', filesUpload);
    document.getElementById('startValidationButton')
        .addEventListener('click', function (event) {
        helloWorld();
    });
    document.getElementById('tryy')
        .addEventListener('click', function () {
        filesUpload();
    });
});
function helloWorld() {
    var res = bundle_js_1.helloworld();
    console.log(res);
}
// function showMeTheName() {
//     let name: string = fileArr[0].name.split(', ')[0];
//     let lastName: string = fileArr[0].name.split(', ')[1].split('_')[0];
//     console.log('this could already work');
//     console.log(name, lastName);
//     pdfParser.on("pdfParser_dataReady", (pdfData) => {
//         console.log(JSON.stringify(pdfData))
//     });
//     pdfParser.loadPDF(fileArr[0]);
//
// }
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
//
// function tryy2 () {
//     pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
//     pdfParser.on("pdfParser_dataReady", pdfData => {
//         fs.writeFile(path.join(__dirname, '../resources/Hilbert, Merlin_2097069_assignsubmission_file_Hilbert_Merlin_2020_12_06.pdf'), JSON.stringify(pdfData), (d) => {
//             console.log(d);});
//     });
//
//     pdfParser.loadPDF("./pdf2json/test/pdf/fd/form/F1040EZ.pdf");
// }
//# sourceMappingURL=main.js.map