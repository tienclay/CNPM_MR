function deleteFile(fileName) {
	// Remove the button and span with the same ID
	$(`#delete-file${fileIds[fileName]}`).remove();
	$(`#span-file${fileIds[fileName]}`).remove();
	$(`#br-delete-file${fileIds[fileName]}`).remove();
	delete fileList[fileName];
	delete printSettings[fileName];
	delete fileIds[fileName];
	URL.revokeObjectURL(fileUrls[fileName]);

	$("#page-indicator").text("");
	$(".shift-page").removeClass("d-inline").addClass("d-none");

	resetSettings();
	if (fileName === fileNameFocus) {
		unpreviewFile();
		tabFocus = "";
		applyFocusTab();

		if (Object.keys(fileIds).length) {
			fileFocus = Math.min(Object.values(fileIds));
			fileNameFocus = Object.keys(fileIds).find((name) => {
				return fileIds[name] == fileFocus;
			});
			previewFile(fileNameFocus);
		}
	}
}

function unpreviewFile() {
	$("#upload-button").removeClass("d-none");
	$("#upload-button").addClass("d-flex");
	$("#preview-file-name").text("");
	$("#pdf-preview").removeClass("d-block");
	$("#pdf-preview").addClass("d-none");

	applyFocusFile("");
}

const SUPPORTED_EXTENSIONS = ["pdf"];

var srcContents = {};
var fileNames = {};
var fileCount = 1;
var fileList = {};
var printSettings = {};
var userID;
var selectPrinterID;
var files = {};
var fileIds = {};
var fileUrls = {};
var fileDocs = {};

var tabFocus = "";
var fileFocus = 0;
var fileNameFocus = "";

var _CANVAS;
var currPage = 1;

// show page of PDF
async function showPage(doc, page_no) {
	// const context = document.querySelector("#pdf-preview").getContext("2d");
	// context.clearRect(0, 0, _CANVAS.width, _CANVAS.height);
	let page = await doc.getPage(page_no);
	// set the scale of viewport
	let scale = Math.min(
		_CANVAS.width / page.getViewport({ scale: 1 }).width,
		_CANVAS.height / page.getViewport({ scale: 1 }).height
	);

	var viewport = page.getViewport({ scale });
	_CANVAS.width = viewport.width;
	_CANVAS.style.width = "100%";
	_CANVAS.height = viewport.height;
	_CANVAS.style.height = "90%";

	var renderContext = {
		canvasContext: document.querySelector("#pdf-preview").getContext("2d"),
		viewport,
	};

	// render the page contents in the canvas
	await page.render(renderContext).promise;
	$("#pdf-preview").removeClass("d-none");
	$("#pdf-preview").addClass("d-block");
	$("#page-indicator").text(`${page_no} / ${doc.numPages}`);
	$(".shift-page").removeClass("d-none").addClass("d-inline");
}

async function readURL(file) {
	var reader = new FileReader();
	reader.onloadend = async function (e) {
		let name = file.name;
		srcContents[fileCount] = e.target.result;
		files[name] = e.target.result;
		var url = URL.createObjectURL(file);
		fileUrls[name] = url;
		let doc = await pdfjsLib.getDocument({ url }).promise;
		fileDocs[name] = doc;
		printSettings[name].pageRangeEnd = doc.numPages;
		$("#pageRangeEnd").attr({ max: doc.numPages });

		previewFile(name);
	};
	reader.readAsDataURL(file);
}

function previewFile(fileName) {
	showPage(fileDocs[fileName], currPage);
	$("#upload-button").removeClass("d-flex");
	$("#upload-button").addClass("d-none");
	$("#preview-file-name").text(fileName);
	matchSettings(fileName);

	applyFocusFile(fileName);

	tabFocus = "btn1";
	applyFocusTab();
}

async function uploadFile() {
	if (this.files[0].name !== "") {
		resetSettings();
		let name = this.files[0].name;

		let extension = name.split(".").at(-1);
		if (!SUPPORTED_EXTENSIONS.includes(extension)) {
			showToast("failToast", "Định dạng file không được hỗ trợ");
			$("#inputFile").val("");
			return;
		}
		fileNameFocus = name;
		printSettings[name] = {};

		await readURL(this.files[0]);
		let htmlFileName = `
		<div id="file-print${fileCount}" class="file-print-div file-print_focus">
			<button onclick="deleteFile('${name}')" class="delete-file" id="delete-file${fileCount}">
				<i class="fa-regular fa-circle-xmark"></i>
			</button>
			<span id='span-file${fileCount}' onclick="previewFile('${name}')">${name}</span>
			<br id='br-delete-file${fileCount}'/>
		</div>
		`;
		fileIds[name] = fileCount;
		fileList[name] = htmlFileName;
		fileCount++;

		$("#inputFile").val("");
		applySettings(name);
		$("#btn1").click();
	}
}

function preventOpenFile(e) {
	e.preventDefault();
	e.stopPropagation();
}

async function dropHandler(e) {
	e.stopPropagation();
	e.preventDefault();

	var files = e.originalEvent.dataTransfer.files;
	if (files[0].name !== "") {
		let name = files[0].name;

		let extension = name.split(".").at(-1);
		if (!SUPPORTED_EXTENSIONS.includes(extension)) {
			showToast("failToast", "Định dạng file không được hỗ trợ");
			$("#inputFile").val("");
			return;
		}

		fileNameFocus = name;
		printSettings[name] = {};

		await readURL(files[0]);
		let htmlFileName = `
		<div id="file-print${fileCount}" class="file-print-div file-print_focus">
			<button onclick="deleteFile('${name}')" class="delete-file" id="delete-file${fileCount}">
				<i class="fa-regular fa-circle-xmark"></i>
			</button>
			<span id='span-file${fileCount}' onclick="previewFile('${name}')">${name}</span>
			<br id='br-delete-file${fileCount}'/>
		</div>
		`;
		fileIds[name] = fileCount;
		fileList[name] = htmlFileName;
		fileCount++;
		$("#inputFile").val("");
		resetSettings();
		applySettings(name);
		$("#btn1").click();
	}
}

$(document).ready(async function () {
	_CANVAS = document.querySelector("#pdf-preview");

	$("#headerbar").html(await getMenuContent());

	$("#inputFile").change(uploadFile);

	$("html").on("dragover", preventOpenFile);
	$("html").on("drop", preventOpenFile);

	$("#drop_zone").on("dragenter", preventOpenFile);
	$("#drop_zone").on("dragover", preventOpenFile);

	$("#drop_zone").on("drop", dropHandler);

	$("#upload-button").on("click", () => {
		$("#inputFile").click();
	});

	$("#printForm").submit(savePrintSettings);

	$("#btn1").click(button1ClickHandler);
	$("#btn2").click(button2ClickHandler);
	$("#btn3").click(button3ClickHandler);
});

// Lắng nghe sự kiện click trên nút 1
function button1ClickHandler() {
	// If no file selected, return
	if (fileNameFocus === "") {
		showToast("failToast", "Hãy upload và chọn file");
		return;
	}
	$("#list-files").html("");
	for (var name in fileList) $(fileList[name]).appendTo("#list-files");

	applyFocusFile(fileNameFocus);

	tabFocus = "btn1";
	applyFocusTab();
}

// Lắng nghe sự kiện click trên nút 2
async function button2ClickHandler() {
	// If no file selected, return
	if (fileNameFocus === "") {
		showToast("failToast", "Hãy upload và chọn file");
		return;
	}

	let text = await getBtn2Content();
	$("#content-btn2 tbody").html(text);

	tabFocus = "btn2";
	applyFocusTab();
}

// Lắng nghe sự kiện click trên nút 3
function button3ClickHandler() {
	// If no file selected, return
	if (fileNameFocus === "") {
		showToast("failToast", "Hãy upload và chọn file");
		return;
	}
	if (!printSettings[fileNameFocus].printerID) {
		showToast("failToast", "Hãy chọn máy in");
		return;
	}
	$("#selectedTime").timepicker({
		timeFormat: "H:i", // 24-hour format
		minTime: "7:00am",
		maxTime: "5:00pm",
		step: 30, // 30-minute intervals
	});

	$("#selectedDate").datepicker({
		minDate: 0, // Minimum date is today
		maxDate: "+7D", // Maximum date is 7 days from today
		beforeShowDay: function (date) {
			// Disable weekends (Saturday: 6, Sunday: 0)
			var day = date.getDay();
			return [day !== 0 && day !== 6, ""];
		},
	});

	tabFocus = "btn3";
	applyFocusTab();
}

// Hàm hiển thị thông tin
function displayInfo(info) {
	// Hiển thị thông tin trong phần tử có id là 'infoDisplay'
	document.getElementById("infoDisplay").innerHTML = info;
}

function applyFocusTab() {
	$("#btn1").removeClass("tab-focus");
	$("#btn2").removeClass("tab-focus");
	$("#btn3").removeClass("tab-focus");
	$("#content-btn1").addClass("d-none");
	$("#content-btn2").addClass("d-none");
	$("#content-btn3").addClass("d-none");
	if (tabFocus != "") {
		$(`#${tabFocus}`).addClass("tab-focus");
		$(`#content-${tabFocus}`).removeClass("d-none");
	}
}

function applyFocusFile(fileName) {
	fileNameFocus = fileName;
	for (const name in fileIds) {
		$(`#file-print${fileIds[name]}`).removeClass("file-print_focus");
	}
	if (fileName != "")
		$(`#file-print${fileIds[fileName]}`).addClass("file-print_focus");
	fileFocus = fileIds[fileName] || 0;
}

async function getBtn2Content() {
	let printers;
	try {
		await $.ajax("http://localhost:3001/printers", {
			method: "GET",
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			success: (data) => {
				printers = data.filter((value) => {
					return value.TinhTrang === "Working";
				});
			},
		});
	} catch (err) {
		await requestToken();
		return getBtn2Content();
	}

	let text = printers
		.map((printer) => {
			return `
				<tr>
					<td class="btn-printerinfo">
						<a href="">
							<img src="./images/user_service/Rectangle 1253.png" width="32px" height="32px" alt="" />
						</a>
					</td>
					<td><b>${printer.Model}</b></td>
					<td>${printer.ID}</td>
					<td>${printer.ViTri}</td>
					<td>HOẠT ĐỘNG</td>
					<td>
						<button
							type="button"
							class="btn-select"
							onclick="selectPrinter('${printer.ID}')" 
							data-bs-toggle="modal"
							data-bs-target="#selectPrinterModal"
						>
							<img src="./images/user_service/printer_select${
								printer.ID ===
								printSettings[fileNameFocus].printerID
									? "ed.svg"
									: ".svg"
							}" />
						</button>
					</td>
				</tr>`;
		})
		.join("");

	return text;
}

function confirmSelectPrinter() {
	printSettings[fileNameFocus].printerID = selectPrinterID;
	$("#btn3").click();
}

function selectPrinter(id) {
	selectPrinterID = id;
}

async function validateSettings() {
	// Check if there are any file which haven't been fully configured
	const settings = printSettings[fileNameFocus];
	if (!settings.date || !settings.time) {
		showToast("failToast", "Hãy chọn thời gian in");
		return;
	}

	// If settings are valid, ask the user for confirmation
	$("#confirmModal").modal("show");
}

async function confirmPrint() {
	// Set timestamp for print file
	printSettings[fileNameFocus].printTime =
		printSettings[fileNameFocus].date + printSettings[fileNameFocus].time;

	// Make a POST request for each file

	let body = {
		userID: Cookies.get("ID"),
		fileName: fileNameFocus,
		filePath: fileNameFocus,
		printDirection: printSettings[fileNameFocus].printDirection,
		pageCount:
			printSettings[fileNameFocus].pageRangeEnd -
			printSettings[fileNameFocus].pageRangeBegin +
			1,
		copyCount: printSettings[fileNameFocus].copyCount,
		printType: printSettings[fileNameFocus].printType,
		paperType: printSettings[fileNameFocus].paperType,
		printerID: printSettings[fileNameFocus].printerID,
		printTime: printSettings[fileNameFocus].printTime,
	};
	try {
		await $.ajax("http://localhost:3001/printing", {
			method: "POST",
			contentType: "application/json",
			beforeSend: function (request) {
				request.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			data: JSON.stringify(body),
			success: (data) => {
				// console.log(data);
				showToast("successToast", "Gửi in file thành công");
				deleteFile(fileNameFocus);
			},
			error: (err) => {
				console.log(err);
			},
		});
	} catch (error) {
		await requestToken();
		return confirmPrint();
		// showToast("failToast", "Xảy ra lỗi khi gửi file in");
	}
}

function savePrintSettings(e) {
	e.preventDefault();
	if (fileNameFocus === "") {
		showToast("failToast", "Hãy chọn file");
		return;
	}

	applySettings(fileNameFocus);

	showToast(
		"successToast",
		`Thông số đã được lưu thành công cho file ${fileNameFocus}`
	);
	$("#btn2").click();
}

function resetSettings() {
	$("#directionInput").val("Portrait");
	$("#pageRangeBegin").val(1);
	$("#pageRangeEnd").val(0);
	$("#copy").val(1);
	$("#printType").val("1 mặt");
	$("#paperSize").val("A4");
}

function matchSettings(fileName) {
	$("#directionInput").val(printSettings[fileName].printDirection);
	$("#pageRangeBegin").val(printSettings[fileName].pageRangeBegin);
	$("#pageRangeEnd").val(printSettings[fileName].pageRangeEnd);
	$("#copy").val(printSettings[fileName].copyCount);
	$("#printType").val(printSettings[fileName].printType);
	$("#paperSize").val(printSettings[fileName].paperType);
}

function applySettings(fileName) {
	if (fileDocs[fileName]) {
		$("#pageRangeEnd").val(fileDocs[fileName].numPages);
	}
	printSettings[fileName].printDirection = $("#directionInput").val();
	printSettings[fileName].pageRangeBegin = $("#pageRangeBegin").val();
	printSettings[fileName].pageRangeEnd = $("#pageRangeEnd").val();
	printSettings[fileName].copyCount = $("#copy").val();
	printSettings[fileName].printType = $("#printType").val();
	printSettings[fileName].paperType = $("#paperSize").val();
}

function validateDate() {
	const inputDate = $("#selectedDate").datepicker("getDate");

	// Check if selected date is not null
	if (inputDate !== null) {
		showToast("successToast", "Chọn ngày thành công");
		printSettings[fileNameFocus].date = inputDate.getTime();
	} else {
		// alert(
		// 	"Please select a valid date within the next 7 days (excluding weekends)."
		// );
		showToast("failToast", "Hãy chọn ngày in");
	}
}

function validateTime() {
	const selectedTime = $("#selectedTime").val();

	// Check if selected time is not empty
	if (selectedTime !== "") {
		showToast("successToast", "Chọn giờ thành công");
		let temp = selectedTime.split(":");
		printSettings[fileNameFocus].time = temp[0] * 3600 + temp[1] * 60;
	} else {
		// alert(
		// 	"Please select a valid time between 7:00 and 17:00 with 30-minute intervals."
		// );
		showToast("failToast", "Hay chọn thời gian in");
	}
}

function setViewPage(diff) {
	if ($(".shift-page").hasClass("d-none")) return;
	currPage += diff;
	if (currPage < 1) currPage = 1;
	if (currPage > fileDocs[fileNameFocus].numPages)
		currPage = fileDocs[fileNameFocus].numPages;
	showPage(fileDocs[fileNameFocus], currPage);
}
