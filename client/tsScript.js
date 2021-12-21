/* ##########################
    T Y P E S
############################# */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var months;
(function (months) {
    months[months["January"] = 0] = "January";
    months[months["Februar"] = 1] = "Februar";
    months[months["M\u00E4rz"] = 2] = "M\u00E4rz";
    months[months["April"] = 3] = "April";
    months[months["Juni"] = 4] = "Juni";
    months[months["Juli"] = 5] = "Juli";
    months[months["August"] = 6] = "August";
    months[months["September"] = 7] = "September";
    months[months["Oktober"] = 8] = "Oktober";
    months[months["November"] = 9] = "November";
    months[months["Dezember"] = 10] = "Dezember";
})(months || (months = {}));
var Student = /** @class */ (function () {
    function Student(fname, name, hr) {
        this.firstName = fname.trim().toLowerCase();
        this.name = name.trim().toLowerCase();
        this.hours = hr;
    }
    return Student;
}());
var ContractsList = /** @class */ (function () {
    function ContractsList() {
        this.contracts = [];
    }
    ContractsList.prototype.addStudent = function (std) {
        this.contracts.push(std);
    };
    ContractsList.prototype.getStdByName = function (name) {
        for (var _i = 0, _a = this.contracts; _i < _a.length; _i++) {
            var c = _a[_i];
            if (name == c.name) {
                return c;
            }
        }
    };
    return ContractsList;
}());
var StundenZettel = /** @class */ (function () {
    function StundenZettel(raw, fn, ln, bDate, month, fBereich) {
        this.raw = raw;
        this.fName = fn.trim().toLowerCase();
        this.name = ln.trim().toLowerCase();
        this.bDate = bDate;
        this.fBereich = fBereich;
        this.month = month;
        this.rowEntries = [];
        this.sumOfHours = -1; // 'Gesamtstunden' auf dem SZ
        this.isSigned = false;
        this.isValid = true;
    }
    StundenZettel.prototype.setStudentData = function (std) {
        this.fName = std.firstName.trim().toLowerCase();
        this.name = std.name.trim().toLowerCase();
        this.hours = std.hours;
    };
    StundenZettel.prototype.setRowEntries = function (row) {
        this.rowEntries.push(row);
    };
    StundenZettel.prototype.addIssue = function (issue) {
        if (!this.issues || this.issues.length < 1) {
            this.issues = [];
        }
        this.issues.push(issue);
        this.isValid = false;
    };
    StundenZettel.prototype.markUnsigned = function () {
        this.isSigned = false;
        this.isValid = false;
    };
    return StundenZettel;
}());
var ProgressBar = /** @class */ (function () {
    function ProgressBar(noe, type, label, color) {
        this.progress = 0;
        this.numOfElements = noe;
        this.type = type;
        this.label = label;
        this.color = color;
        this.targetDiff = document.getElementById('progress-bar-target-diff');
        this.isInitialized = false;
    }
    ProgressBar.prototype.initProgressBar = function () {
        this.targetDiff.classList.add('progress');
        this.targetDiff.parentElement.classList.add('wrapper');
        var progEl = "<div class=\"progress-bar-container\">\n        <label\n        for=\"progress-bar-" + this.type + "-" + this.label + "\"\n        id=\"label-" + this.type + "-" + this.label + "\">\n          " + this.type + ": " + this.label + ".\n        </label>\n        <div\n          id=\"progress-bar-" + this.type + "-" + this.label + "\"\n          class=\"progress-bar progress-bar-striped progress-bar-animated bg-" + this.color + " " + this.type + "-" + this.label + "\"\n          role=\"progressbar\" style=\"width: " + this.progress + "%;\"\n          aria-valuenow=\"" + this.progress + "\"\n          aria-valuemin=\"0\"\n          aria-valuemax=\"100\"\n        >\n        </div>\n      </div>\n    ";
        this.targetDiff.innerHTML = this.targetDiff.innerHTML + progEl;
        this.progressElement = this.targetDiff.getElementsByClassName(this.type + '-' + this.label)[0];
        this.isInitialized = true;
    };
    ProgressBar.prototype.addItems = function (n) {
        this.numOfElements += n;
    };
    ProgressBar.prototype.updateProgress = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.progress += 100 / this.numOfElements;
                if (this.progress > 100)
                    this.progress = 100;
                if (this.progress === 100) {
                    this.endProgression();
                }
                this.renderProgressBar();
                return [2 /*return*/];
            });
        });
    };
    ProgressBar.prototype.renderProgressBar = function () {
        this.progressElement.setAttribute('style', "width: " + this.progress + "%");
        this.progressElement.setAttribute('aria-valuenow', "" + this.progress);
        this.progressElement.innerHTML = this.progress + '%';
    };
    ProgressBar.prototype.endProgression = function () {
        this.progressBarLabel = document.getElementById("label-" + this.type + "-" + this.label);
        this.progressElement.classList.remove('progress-bar-animated');
        var checkMark = '&#10004;';
        this.progressBarLabel.innerHTML =
            this.progressBarLabel.innerHTML + checkMark;
    };
    ProgressBar.prototype.deleteProressBar = function () {
        this.targetDiff.innerHTML = '';
        this.targetDiff.classList.remove('progress');
    };
    return ProgressBar;
}());
/* ##########################
    G L O B A L S
############################# */
var ContractList = new ContractsList();
var StundenzettelList = [];
var ValidatedSZList = [];
var holidayLibrary;
// USER FEEDBACK
var progressBarSZListRead;
var progressBarSZListParse;
var progressBarValidation;
// #######################################
function handleContractListInput(list) {
    var reader = new FileReader();
    try {
        reader.onload = function (ev) {
            var _a;
            var c = (_a = ev.target.result.toString()) === null || _a === void 0 ? void 0 : _a.split('\r\n');
            for (var i = 1; i < c.length; i++) {
                if (c[i] != '') {
                    var _b = c[i].split(';'), firstName = _b[0], name_1 = _b[1], hours = _b[2];
                    ContractList.addStudent(new Student(firstName.trim().toLowerCase(), name_1.trim().toLowerCase(), Number(hours.trim().toLowerCase())));
                }
            }
        };
        reader.readAsText(list);
    }
    catch (e) {
        console.error(e);
    }
}
function handleSZListInput(list) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenizedTextList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    progressBarSZListRead.initProgressBar();
                    progressBarSZListRead.addItems(list.length);
                    return [4 /*yield*/, readSZFiles(list)];
                case 1:
                    tokenizedTextList = _a.sent();
                    progressBarSZListParse.initProgressBar();
                    progressBarSZListParse.addItems(tokenizedTextList.length);
                    return [4 /*yield*/, parseTokenizedText(tokenizedTextList).then(function (parsedList) {
                            return parsedList.sort(function (a, b) { var _a; return (_a = a === null || a === void 0 ? void 0 : a.name) === null || _a === void 0 ? void 0 : _a.localeCompare(b === null || b === void 0 ? void 0 : b.name); });
                        })];
                case 2:
                    StundenzettelList = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function readSZFiles(list) {
    return __awaiter(this, void 0, void 0, function () {
        var pdfjsLib, pageTextsResultList, _loop_1, _i, list_1, sz;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pdfjsLib = window['pdfjs-dist/build/pdf'];
                    pdfjsLib.GlobalWorkerOptions.workerSrc =
                        '//mozilla.github.io/pdf.js/build/pdf.worker.js';
                    pageTextsResultList = [];
                    _loop_1 = function (sz) {
                        var data, pdf_1, maxPages, pageNo, _b, raw, text, e_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 7, , 8]);
                                    return [4 /*yield*/, sz.arrayBuffer()];
                                case 1:
                                    data = _c.sent();
                                    return [4 /*yield*/, pdfjsLib.getDocument({ data: data }).promise];
                                case 2:
                                    pdf_1 = _c.sent();
                                    maxPages = pdf_1.numPages;
                                    pageNo = 1;
                                    _c.label = 3;
                                case 3:
                                    if (!(pageNo <= maxPages)) return [3 /*break*/, 6];
                                    return [4 /*yield*/, getPageText(pdf_1, pageNo).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, progressBarSZListRead.updateProgress()];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/, { raw: pdf_1, text: res }];
                                                }
                                            });
                                        }); })];
                                case 4:
                                    _b = _c.sent(), raw = _b.raw, text = _b.text;
                                    if (!(text.length > 1)) {
                                        handleManualChecking(pdf_1, sz.name, sz.lastModified);
                                    }
                                    else {
                                        pageTextsResultList.push({ raw: raw, text: text });
                                    }
                                    _c.label = 5;
                                case 5:
                                    pageNo++;
                                    return [3 /*break*/, 3];
                                case 6: return [3 /*break*/, 8];
                                case 7:
                                    e_1 = _c.sent();
                                    console.error(e_1);
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, list_1 = list;
                    _a.label = 1;
                case 1:
                    if (!(_i < list_1.length)) return [3 /*break*/, 4];
                    sz = list_1[_i];
                    return [5 /*yield**/, _loop_1(sz)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, pageTextsResultList];
            }
        });
    });
}
var getPageText = function (pdf, pageNo) { return __awaiter(_this, void 0, void 0, function () {
    var page, tokenizedText, pageText;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pdf.getPage(pageNo)];
            case 1:
                page = _a.sent();
                return [4 /*yield*/, page.getTextContent()];
            case 2:
                tokenizedText = _a.sent();
                pageText = tokenizedText.items.map(function (token) { return token.str.trim(); });
                pageText = pageText.filter(function (token) { return token.trim() !== ''; });
                return [2 /*return*/, pageText];
        }
    });
}); };
function parseTokenizedText(list) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, list.map(function (_a) {
                    var raw = _a.raw, tokenList = _a.text;
                    if (tokenList.length > 0) {
                        var header = tokenList.slice(0, 10);
                        var sz = new StundenZettel(raw, header[5], // firstName
                        header[1], // lastName
                        header[9], // bDate
                        header[3], // month
                        header[7]);
                        var endOfTable = tokenList.indexOf('Gesamtstunden:');
                        var table = tokenList.slice(14, endOfTable);
                        for (var i = 0; i < table.length; i += 1) {
                            if (table[i].indexOf(':') !== -1) {
                                var rowSum = table[i + 2];
                                var mid = rowSum === null || rowSum === void 0 ? void 0 : rowSum.indexOf(':');
                                var hours = +(rowSum === null || rowSum === void 0 ? void 0 : rowSum.slice(0, mid));
                                var minutes = +(rowSum === null || rowSum === void 0 ? void 0 : rowSum.slice(mid + 1, rowSum.length + 1));
                                minutes = minutes / 60;
                                sz.setRowEntries({
                                    day: +table[i - 1],
                                    start: table[i],
                                    end: table[i + 1],
                                    sum: hours + minutes,
                                });
                                i += 3;
                            }
                        }
                        sz.sumOfHours = tokenList.length
                            ? +tokenList[endOfTable + 1].slice(0, tokenList[endOfTable + 1].indexOf(':'))
                            : -2;
                        if (ContractList.contracts.length > 0) {
                            // todo das klappt noch net
                            var stdFromContract = ContractList.getStdByName(sz.name);
                            if (stdFromContract) {
                                sz.setStudentData(stdFromContract);
                            }
                        }
                        progressBarSZListParse.updateProgress();
                        return sz;
                    }
                })];
        });
    });
}
function handleValidation() {
    return __awaiter(this, void 0, void 0, function () {
        var validationPromises, _i, StundenzettelList_1, sz;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    validationPromises = [];
                    if (!progressBarValidation.isInitialized) {
                        progressBarValidation.initProgressBar();
                        progressBarValidation.addItems(StundenzettelList.length);
                    }
                    if (ValidatedSZList != StundenzettelList) {
                        try {
                            for (_i = 0, StundenzettelList_1 = StundenzettelList; _i < StundenzettelList_1.length; _i++) {
                                sz = StundenzettelList_1[_i];
                                validationPromises.push(validate(sz).then(function () {
                                    progressBarValidation.updateProgress();
                                }));
                            }
                            ValidatedSZList = StundenzettelList;
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                    return [4 /*yield*/, Promise.all(validationPromises)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function validate(sz) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, entry, workedDay, sumOfWorkHours_1, issueMsg;
        return __generator(this, function (_b) {
            try {
                // check for workday == holiday
                for (_i = 0, _a = sz.rowEntries; _i < _a.length; _i++) {
                    entry = _a[_i];
                    workedDay = new Date(new Date().getFullYear(), +sz.month, entry.day);
                    if (holidayLibrary.isHoliday(workedDay)) {
                        sz.addIssue("Einer der Eintr\u00E4ge scheint an einem Feiertag gewesen zu sein. \n\n           Tag: " + entry.day + ", " + sz.month + " | " + entry.start + " - " + entry.end + " - " + entry.sum);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
            try {
                sumOfWorkHours_1 = 0;
                sz.rowEntries.map(function (entry) { return (sumOfWorkHours_1 += entry.sum); });
                if (sumOfWorkHours_1 !== sz.sumOfHours) {
                    sz.addIssue("Die Summe der einzelnen Eintr\u00E4ge stimmt nicht mit den Gesamtstunden \u00FCberein.");
                }
            }
            catch (error) {
                console.log(error);
            }
            try {
                // comparison workHours and contracted hours
                if (sz.hours != sz.sumOfHours) {
                    issueMsg = 'Diesen Monat hat die Person zu ' +
                        (sz.hours > sz.sumOfHours ? 'viel' : 'wenig') +
                        ' gearbeitet.';
                    sz.addIssue(issueMsg);
                }
            }
            catch (error) {
                console.log(error);
            }
            return [2 /*return*/];
        });
    });
}
function renderResultTable(szList) {
    if (szList === void 0) { szList = StundenzettelList; }
    return __awaiter(this, void 0, void 0, function () {
        var table, tBody, tHead, tableHeadColNames, _i, szList_1, sz, tHeadRow, i, cell, checkMark, crossMark, fName, name_2, month, isValid, rowData, tr, i, td;
        return __generator(this, function (_a) {
            table = document.getElementById('table');
            tBody = document.getElementById('tBody');
            tHead = table.createTHead();
            tableHeadColNames = ['Fist Name', 'Name', 'Month', 'Valid'];
            tBody.innerHTML = null;
            tBody.innerText = null;
            // todo sz object keys are a little more now than needed
            for (_i = 0, szList_1 = szList; _i < szList_1.length; _i++) {
                sz = szList_1[_i];
                try {
                    if (tHead.rows.length === 0) {
                        tHeadRow = tHead.insertRow(0);
                        for (i = 0; i < tableHeadColNames.length; i++) {
                            cell = tHeadRow.insertCell();
                            cell.innerHTML = tableHeadColNames[i];
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                }
                try {
                    checkMark = '&#10004';
                    crossMark = '&#10060;';
                    fName = sz.fName;
                    name_2 = sz.name;
                    month = sz.month;
                    isValid = sz.isValid;
                    rowData = [fName, name_2, month, isValid ? checkMark : crossMark];
                    tr = tBody.appendChild(document.createElement('TR'));
                    // insert data
                    for (i = 0; i < rowData.length; i++) {
                        td = tr.appendChild(document.createElement('TD'));
                        td.innerHTML = rowData[i];
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
            return [2 /*return*/];
        });
    });
}
// type == 'prev' || 'next'
var createCarouselControlButton = function (type) {
    var controlBtn = document.createElement('BUTTON');
    var iconSpan = document.createElement('SPAN');
    var textSpan = document.createElement('SPAN');
    iconSpan.classList.add('carousel-control-' + type + '-icon');
    iconSpan.ariaHidden = 'true';
    textSpan.classList.add('sr-only');
    textSpan.innerText = type === 'prev' ? 'Previous' : 'Next';
    controlBtn.classList.add('carousel-control-' + type);
    controlBtn.type = 'button';
    controlBtn.setAttribute('data-target', '#carousel-parent');
    controlBtn.setAttribute('data-slide', type);
    controlBtn.appendChild(iconSpan);
    controlBtn.appendChild(textSpan);
    controlBtn.addEventListener('click', function () {
        changeNameMonthForSlide(type);
    });
    return controlBtn;
};
function changeNameMonthForSlide(type) {
    var descIdentP = document.getElementById('descriptiveIdentifier');
    var idCurrSz = function () { return Number(descIdentP.getAttribute('data-current-sz')); };
    var nextIdSz = (type == 'prev' ? -1 : 1) + idCurrSz();
    descIdentP.innerHTML = '';
    descIdentP.innerHTML =
        document
            .getElementsByClassName('carousel-item active')[0]
            .getElementsByTagName('canvas')[0]
            .getAttribute('data-sz-month') +
            ': ' +
            document
                .getElementsByClassName('carousel-item active')[0]
                .getElementsByTagName('canvas')[0]
                .getAttribute('data-sz-month') +
            '.';
    console.log(document
        .getElementsByClassName('carousel-item active')[0]
        .getElementsByTagName('canvas')[0]
        .getAttribute('data-sz-month'));
}
function renderSignatureCheck() {
    return __awaiter(this, void 0, void 0, function () {
        var targetCarouselDif, carouselInner, descIdentP, _loop_2, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    targetCarouselDif = document.getElementById('carousel-parent');
                    carouselInner = document.createElement('DIV');
                    descIdentP = document.getElementById('descriptiveIdentifier');
                    carouselInner.classList.add('carousel-inner');
                    targetCarouselDif.appendChild(carouselInner);
                    _loop_2 = function (i) {
                        var sz, carouselItemDiv, coverupDivLeft, canvas, coverupDivRight;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    sz = ValidatedSZList[i];
                                    if (i == 0) {
                                        descIdentP.setAttribute('data-current-sz', i.toString());
                                        descIdentP.innerText = '';
                                        descIdentP.innerText = sz.name + ': ' + sz.month + '.';
                                    }
                                    carouselItemDiv = document.createElement('div');
                                    carouselItemDiv.setAttribute('data-target', i.toString());
                                    carouselItemDiv.classList.add('carousel-item');
                                    if (i == 0) {
                                        carouselItemDiv.classList.add('active');
                                    }
                                    // add clickeventhandler to Carouselitem to mark as unSigned
                                    carouselItemDiv.addEventListener('click', function (target) {
                                        ValidatedSZList[i].markUnsigned();
                                        carouselItemDiv.classList.add('selected');
                                        renderResultTable(ValidatedSZList);
                                    });
                                    carouselInner.appendChild(carouselItemDiv);
                                    coverupDivLeft = document.createElement('div');
                                    coverupDivLeft.classList.add('coverup');
                                    carouselItemDiv.appendChild(coverupDivLeft);
                                    return [4 /*yield*/, renderPdfOnCanvas(carouselItemDiv, sz.raw, 2, i)];
                                case 1:
                                    canvas = _b.sent();
                                    canvas.setAttribute('style', 'bottom: -70%;' +
                                        'right: ' +
                                        // (carouselItemDiv.offsetWidth / 2 - canvas.width * 0.25).toString() +
                                        // 'px;',
                                        '25%;');
                                    canvas.setAttribute('data-sz-name', sz.name);
                                    canvas.setAttribute('data-sz-month', sz.month);
                                    coverupDivRight = document.createElement('div');
                                    coverupDivRight.classList.add('coverup');
                                    carouselItemDiv.appendChild(coverupDivRight);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < ValidatedSZList.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_2(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    // append control buttons last
                    targetCarouselDif.appendChild(createCarouselControlButton('prev'));
                    targetCarouselDif.appendChild(createCarouselControlButton('next'));
                    return [2 /*return*/];
            }
        });
    });
}
// name is the name of the file and the id is the unix timestamp of the file
// should be unique enough for this
function handleManualChecking(pdf, cardHeaderText, pdfId) {
    return __awaiter(this, void 0, void 0, function () {
        var targetParentDifId, targetParentDif, descriptionDiv, cardHeader, cardBody, card, cardBodyEl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    targetParentDifId = 'modals';
                    targetParentDif = document.getElementById(targetParentDifId);
                    descriptionDiv = document.getElementById('modal-description');
                    descriptionDiv.removeAttribute('hidden');
                    targetParentDif.parentElement.classList.add('wrapper');
                    cardHeader = "\n  <div class=\"card-header\" id=heading-" + pdfId + ">\n    <h5 class=\"mb-0\">\n      <button\n        class=\"btn\"\n        data-toggle=\"modal\"\n        data-target=\"#modal-" + pdfId + "\"\n      >\n        " + cardHeaderText + "\n      </button>\n    </h5>\n  </div>\n    ";
                    cardBody = "\n  <div\n    id=\"modal-" + pdfId + "\"\n    class=\"modal fade\"\n    table-index=\"-1\"\n    aria-labelledby=\"modal-label-" + pdfId + "\"\n    data-parent=\"#" + targetParentDifId + "\"\n  >\n    <div class=\"modal-dialog modal-lg\">\n\n      <div class=\"modal-body\" id=\"modal-body-" + pdfId + "\"\">\n\n      </div>\n    </div>\n  </div>\n  ";
                    card = document.createElement('div');
                    card.classList.add('card');
                    card.innerHTML = cardHeader + cardBody;
                    targetParentDif.appendChild(card);
                    cardBodyEl = document.getElementById('modal-body-' + pdfId);
                    return [4 /*yield*/, renderPdfOnCanvas(cardBodyEl, pdf)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function renderPdfOnCanvas(appendEl, pdf, scale, id) {
    if (scale === void 0) { scale = 1; }
    if (id === void 0) { id = null; }
    return __awaiter(this, void 0, void 0, function () {
        var canvas, canvasContext, page, viewport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    canvas = document.createElement('canvas');
                    appendEl.appendChild(canvas);
                    if (id !== null) {
                        canvas.id = 'canvas-' + id;
                    }
                    canvasContext = canvas.getContext('2d');
                    return [4 /*yield*/, pdf.getPage(1)];
                case 1:
                    page = _a.sent();
                    viewport = page.getViewport({ scale: scale });
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    /*
                    let task = await page.render({ canvasContext, viewport });
                    let data = [];
                    data.push(canvas.toDataURL('image/jpeg')); // this would get the data as "jpeg string"
                    */
                    return [4 /*yield*/, page.render({ canvasContext: canvasContext, viewport: viewport })];
                case 2:
                    /*
                    let task = await page.render({ canvasContext, viewport });
                    let data = [];
                    data.push(canvas.toDataURL('image/jpeg')); // this would get the data as "jpeg string"
                    */
                    _a.sent();
                    return [2 /*return*/, canvas];
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    var szInput = document.getElementById('uploadInputSZ');
    var contractsInput = document.getElementById('uploadInputList');
    var validateBtn = document.getElementById('startValidationButton');
    var scrollBtn = document.getElementById('scrollArrow');
    // initialize Holiday library
    holidayLibrary = globalThis.holiday;
    holidayLibrary.setState('he');
    // initialize progressBar classes
    progressBarSZListRead = new ProgressBar(0, 'StundenZettel', 'Read', 'success');
    progressBarSZListParse = new ProgressBar(0, 'StundenZettel', 'Parse', 'info');
    progressBarValidation = new ProgressBar(0, 'Validation', 'Validate', 'warning');
    /**
     * Add EventListeners to inputs and buttons
     */
    contractsInput.addEventListener('change', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(contractsInput.files[0] !== undefined)) return [3 /*break*/, 2];
                    return [4 /*yield*/, handleContractListInput(contractsInput.files[0])];
                case 1:
                    _a.sent();
                    szInput.disabled = false;
                    enableValidation();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    szInput.addEventListener('change', function () { return __awaiter(_this, void 0, void 0, function () {
        var temp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    disableValidation();
                    if (!(szInput.files[0] !== undefined)) return [3 /*break*/, 2];
                    temp = szInput.files.length < 1 ? [].concat(szInput.files)[0] : szInput.files;
                    return [4 /*yield*/, handleSZListInput(temp).then(function () {
                            enableValidation();
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    validateBtn.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(szInput.files.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, handleValidation().then(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                renderResultTable().then(function () {
                                    renderSignatureCheck();
                                    showScrollButton();
                                });
                                return [2 /*return*/];
                            });
                        }); })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    scrollBtn.addEventListener('click', function () {
        window.scroll(0, window.outerHeight);
    });
    // Functions called by EventListeners
    function enableValidation() {
        var contractsUploaded = ContractList.contracts.length > 0;
        var szListUploaded = StundenzettelList.length > 0;
        if (szListUploaded && contractsUploaded) {
            validateBtn.classList.remove('disabled');
        }
    }
    function disableValidation() {
        validateBtn.classList.add('disabled');
    }
    function showScrollButton() {
        scrollBtn.removeAttribute('hidden');
        scrollBtn.removeAttribute('disabled');
    }
});
// todo
/*
  aktuell werden die sollstunden in stundenzettel.hours gespeichert
  -> in zukunft diese im Student speichern und dem Student einen Stundenzettel[]
  => validierung und rendern pro Student mölich
  => logischerer und angenehmerer aufbau
*/
//# sourceMappingURL=tsScript.js.map