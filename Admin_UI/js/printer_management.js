const SIZE = 6;

var printers;
var filteredPrinters;
var currPage = 0;
var totalPapers = 0;
var totalSessions = 0;

/*
This function is to get printer data from the server
*/
async function getPrinterInfo() {
	// implement
	try {
		await $.ajax("http://localhost:3001/printers", {
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			success: (data) => {
				printers = data;
				filteredPrinters = printers.filter(() => true);
			},
		});
	} catch (error) {
		console.log(error);
	}
}

/*
this play general 
*/
function displayPrinterInfo() {
	$("tbody").html("");
	if (filteredPrinters.length == 0) {
		$(".pagination-row").removeClass("d-flex").addClass("d-none");
		$("tbody").append(
			$(`<tr>
				<td colspan="8" class="text-secondary text-center">
					Không có kết quả
				</td>
			</tr>`)
		);
		return;
	}

	$(".pagination-row").removeClass("d-none").addClass("d-flex");
	while (currPage * SIZE >= filteredPrinters.length) currPage--;
	if (currPage < 0) currPage = 0;

	let begin = currPage * SIZE;
	let end = Math.min((currPage + 1) * SIZE, filteredPrinters.length);

	for (let i = begin; i < end; i++) {
		let printer = filteredPrinters[i];
		let row = `
            <tr id="row${printer.ID}" class="${
			printer.TinhTrang == "Disabled" ? "disabled-row" : ""
		}">
				<td scope="col pt-0" class="checkSingle">
					<input
						class="form-check-input"
						type="checkbox"
						value="-1"
						id="printer${printer.ID}"
					/>
				</td>
				<td scope="col pt-0" class="printer_list_data">
					${i + 1}
				</td>
				<td scope="col pt-0" class="printer_list_data">
					${printer.Model}
				</td>
				<td scope="col pt-0" class="printer_list_data" id="${printer.ID}">
					${printer.ID}
				</td>
				<td scope="col pt-0" class="printer_list_data">
					${printer.ViTri}
				</td>
				<td scope="col pt-0" class="printer_list_data text-center">
					<span
						class="${printer.TinhTrang == "Working" ? "enable" : "disable"} px-2"
						id="status${printer.ID}"
					>
						${printer.TinhTrang == "Working" ? "Hoạt động" : "Vô hiệu hóa"}
					</span>
				</td>
				<td scope="col pt-0 my-0 p-0" class="text-center">
					<a href="printer_detail.html?printerid=${printer.ID}" class="btn p-0 border-0">
						<img src="image/admin_printer/info.png" alt="info" class="infoPrinterBtn" id="info${printer}">
					</a> 
					<button
						class="btn p-0 border-0"
						type="button"
						onclick="deletePrinter('${printer.ID}')"
					>
						<img
							src="image/admin_printer/delete.png"
							alt="del"
							class="delPrinterBtn"
							id="del${printer.ID}"
						/>
					</button>
				</td>
				<td scope="col pt-0">
					<div class="form-check form-switch p-0 m-0 toggle-status">
						<input
							class="form-check-input toggle_status w-50"
							type="checkbox"
							value=1
							role="switch"
							id="toggle${printer.ID}"
							${printer.TinhTrang == "Working" ? " checked" : ""}
							onchange="toggleStatus('${printer.ID}')"
						/>
					</div>
				</td>
            </tr>
        `;
		$("tbody").append(row);
	}

	$("#pageNumber").val(currPage + 1);
}

async function toggleStatus(id) {
	try {
		await $.ajax(`http://localhost:3001/printers/${id}/status`, {
			method: "PUT",
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			success: (data) => {
				$(`#row${id}`).toggleClass("disabled-row");
				$(`#status${id}`).toggleClass("enable");
				$(`#status${id}`).toggleClass("disable");
				$(`#status${id}`).text(
					data.TinhTrang == "Working" ? "Hoạt động" : "Vô hiệu hóa"
				);
				showToast("successToast", "Thay đổi trạng thái thành công");
			},
			error: (error) => {
				console.log(error);
			},
		});
	} catch (error) {
		showToast("failToast", "Thay đổi trạng thái thất bại");
		$(`#toggle${id}`).prop("checked", !$(`#toggle${id}`).is(":checked"));
	}
}

async function deletePrinter(id) {
	if ($(`#status${id}`).hasClass("enable")) {
		showToast("failToast", "Máy in đang hoạt động");
		return;
	}
	try {
		$.ajax(`http://localhost:3001/printers/${id}`, {
			method: "DELETE",
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			success: async (msg) => {
				showToast("successToast", "Máy in đã được xóa");

				// Remove printer from global list
				printers = printers.filter((element) => element.ID !== id);
				filteredPrinters = printers.filter(() => true);

				// Update number of printers
				$(`#printer_number .quantity`).text(printers.length);

				// Display list of printers again
				displayPrinterInfo();
			},
		});
	} catch (error) {
		showToast("failToast", "Xóa máy in không thành công");
	}
}

async function getGeneralInfo() {
	try {
		await $.ajax("http://localhost:3001/printers/totalpage", {
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			success: (data) => {
				totalPapers = data;
			},
		});
		await $.ajax("http://localhost:3001/printers/totalprints", {
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			success: (data) => {
				totalSessions = data;
			},
		});
	} catch (error) {
		console.log(error);
		showToast("failToast", `Error while fetching general info`);
	}
}

function displayGeneralInfo() {
	$(`#printer_number .quantity`).text(printers.length);
	$(`#paper_number .quantity`).text(totalPapers);
	$(`#print_session_number .quantity`).text(totalSessions);
}

function createPrinter(e) {
	e.preventDefault();

	let data = {
		ID: "MI0099",
		Hang: escapeHtml(e.target["firm"].value),
		Model: escapeHtml($("#model>input").val()),
		KhayGiay: escapeHtml($("#capacity>input").val()),
		LoaiMuc: escapeHtml($("#ink>input").val()),
		ViTri: escapeHtml($("#location>input").val()),
		TinhTrang: escapeHtml(
			$("#status>span").text() == "Kích hoạt" ? "Working" : "Disabled"
		),
		InMau: $("#yes").is(":checked"),
		CongSuat: escapeHtml($("#watt>input").val()),
		TrongLuong: escapeHtml($("#weight>input").val()),
		Kieu: escapeHtml($("#type_printer>input").val()),
		TocDoIn: escapeHtml($("#speed>input").val()),
		KichThuoc: escapeHtml($("#shape>input").val()),
		BoNho: escapeHtml($("#memory>input").val()),
		AnhMayIn:
			"https://s3.pricemestatic.com/Large/Images/RetailerProductImages/StRetailer1450/rp_39470408_0021477728_l.png",
		DoPhanGiai: escapeHtml($("#resolution>input").val()),
	};
	let preprocessedInput = preprocessInput(
		...[
			"TocDoIn",
			"BoNho",
			"DoPhanGiai",
			"KhayGiay",
			"CongSuat",
			"TrongLuong",
			"KichThuoc",
		].map((key) => data[key])
	);
	for (let i = 0; i < preprocessedInput.length; i++) {
		let key = [
			"TocDoIn",
			"BoNho",
			"DoPhanGiai",
			"KhayGiay",
			"CongSuat",
			"TrongLuong",
			"KichThuoc",
		];
		data[key[i]] = preprocessedInput[i];
	}
	let valid = validateInput(...preprocessedInput);

	if (!valid) {
		showToast("failToast", "Thông tin không hợp lệ");
		return;
	} else {
		$.ajax("http://localhost:3001/printers/", {
			method: "POST",
			beforeSend: function (req) {
				req.setRequestHeader(
					"Authorization",
					"Bearer: " + Cookies.get("accessToken")
				);
			},
			contentType: "application/json",
			data: JSON.stringify(data),
			success: async function (msg) {
				console.log(msg);
				if (msg.message == "Printer added successfully") {
					showToast("successToast", "Thêm máy in thành công");
					$("tbody").html("");
					$(".cancel-form").click();
					await getPrinterInfo();
					await getGeneralInfo();
					displayPrinterInfo();
					displayGeneralInfo();
				} else {
					showToast("failToast", "Thêm máy in thấy bại");
				}
			},
			error: function () {
				showToast("failToast", "Thêm máy in thất bại");
			},
		});
	}
}

$(document).ready(async function () {
	await getPrinterInfo();
	await getGeneralInfo();

	displayPrinterInfo();
	displayGeneralInfo();

	$("#menu").html(getMenuContent());

	$("#account_bar").html(getAccountBarContent());

	$("#printer_management_button").css("background-color", "#C8C2F2");

	$("#logo").click(function () {
		window.location.href = "home_admin.html";
	});

	$("#checkAll").click(function () {
		$(".checkSingle>input").not(this).prop("checked", this.checked);
	});

	$(".checkSingle>input").click(function () {
		if (
			$(".checkSingle>input:checked").length ==
			$(".checkSingle>input").length
		) {
			$("#checkAll").prop("checked", true);
		} else {
			$("#checkAll").prop("checked", false);
		}
	});

	$(".btn-check").click(function () {
		$(".btn-check").not(this).prop("checked", !this.checked);
	});

	$("#upload-image>button").click(function () {});

	$("form").submit(createPrinter);

	$("#nextPage").click(function () {
		currPage++;
		displayPrinterInfo();
	});

	$("#previousPage").click(function () {
		currPage--;
		displayPrinterInfo();
	});

	$("#gotoPage").click(function () {
		currPage = $("#pageNumber").val();
		displayPrinterInfo();
	});

	$("#pageNumber").keydown(function (e) {
		if (e.which == 13) {
			$("#gotoPage").click();
		}
	});

	$("#search_bar").on("input", async function () {
		currPage = 0;
		filterPrinters();
		displayPrinterInfo();
	});
});

async function filterPrinters() {
	let val = $(`#search_bar`).val().toLowerCase();
	filteredPrinters = printers.filter((element) => {
		return (
			element.ID.toLowerCase().includes(val) ||
			element.Model.toLowerCase().includes(val)
		);
	});
}
