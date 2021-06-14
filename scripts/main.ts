// import * as PDFReader  from '../node_modules/pdf2json'
import { helloworld } from './bundle.js'

// let pdfParser = new PDFReader();

let fileArr: File[] = [];
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('uploadInput');
    input.addEventListener('change', filesUpload);

    document.getElementById('startValidationButton')
        .addEventListener('click', (event) => {
            helloWorld();
        });

    document.getElementById('tryy')
        .addEventListener('click', () => {
            filesUpload();
        })
});

function helloWorld() {
    const res = helloworld();
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
    let reader = new FileReader()
    reader.onload =  function (ev) {
        let result: string = String(ev.target.result);
        console.log(result);
    }
    reader.readAsBinaryString(fileArr[0]);
}

function filesUpload() {
    let temp: FileList = (event.target as HTMLInputElement).files;
    fileArr.push(temp[0])
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


