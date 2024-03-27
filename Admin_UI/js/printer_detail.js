const SIZE = 6;
var currPage = 0;
var printerID;
var printer = {};
var printerHistory = [];

function resetinput() {
	$(".changable>input").css("color", "black");
	$("#location>input").val(printer.ViTri);
	$("#status>input").val(printer.TinhTrang);
	$("#type_printer>input").val(printer.Kieu);
	$("#speed>input").val(printer.TocDoIn);
	$("#memory>input").val(printer.BoNho);

	// $("#resolution>input").val(printer.D)
	$("#support_color>input").val(printer.InMau ? "Có" : "Không");
	if (printer.InMau) {
		$("#yes").prop("checked", true);
	} else {
		$("#no").prop("checked", true);
	}
	$("#capacity>input").val(printer.KhayGiay);
	$("#ink>input").val(printer.LoaiMuc);
	$("#watt>input").val(printer.CongSuat);
	$("#weight>input").val(printer.TrongLuong);
	$("#shape>input").val(printer.KichThuoc);
}

function updateInfo() {
	$("#firm-name").html(printer.Hang);
	$("#printer_id").html(printer.ID);
	$("#printer_model").html(printer.Model);
	$("#location>span").html(printer.ViTri);
	$("#status>span").html(
		printer.TinhTrang == "Working" ? "Kích hoạt" : "Vô hiệu hóa"
	);
	$("#type_printer>span").html(printer.Kieu);
	$("#speed>span").html(printer.TocDoIn);
	$("#memory>span").html(printer.BoNho);
	$("#shape>span").html(printer.KichThuoc);
	$("#capacity>span").html(printer.KhayGiay);
	$("#ink>span").html(printer.LoaiMuc);
	$("#watt>span").html(printer.CongSuat);
	$("#support_color>span").html(printer.InMau ? "Có" : "Không");
	$("#weight>span").html(printer.TrongLuong);
}

async function getPrinterHistory() {
	try {
		await $.ajax(`http://localhost:3001/history/printer/${printerID}`, {
			method: "GET",
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			success: (data) => {
				printerHistory = data;
			},
		});
	} catch (error) {}
}

function showPrinterHistory() {
	$("tbody").html("");

	if (printerHistory.length == 0) {
		let row = $('<tr class="my-2"></tr>');
		row.append(
			$(
				`<td colspan="5" class="text-center text-secondary">Không có kết quả</td>`
			)
		);
		$("tbody").append(row);
		$("div.pagination-row").removeClass("d-flex");
		$("div.pagination-row").addClass("d-none");
		return;
	}

	while (currPage * SIZE >= printerHistory.length) currPage--;
	if (currPage < 0) currPage = 0;

	let begin = currPage * SIZE;
	let end = Math.min((currPage + 1) * SIZE, printerHistory.length);

	for (var i = begin; i < end; i++) {
		let data = printerHistory[i];
		let row = $('<tr class="my-2"></tr>');
		row.append(
			$(`
            <td>${data.NguoiDung}<br>
            <footer class="Montserrat-500 text-secondary">${data.IDNguoiDung}</footer>
            </td>`)
		);
		row.append(
			$(`
            <td>${dateProcess(data.ThoiGian)}<br>
            <footer class="Montserrat-500 text-secondary">${timeProcess(
				data.ThoiGian
			)}</footer>
            </td>
        `)
		);
		row.append(
			$(`
            <td>${data.SoTrang}<br>
            <footer class="Montserrat-500 text-secondary">${data.LoaiGiay}</footer>
            </td>
        `)
		);
		row.append($(`<td>${data.TenTaiLieu}</td>`));
		row.append(
			$(`
        <td class="d-flex justify-content-center align-items-center">
            <span class='text-center ${
				{
					"Hoàn Thành": "successStatus",
					"Đang In": "inprogressStatus",
					"Chờ Xử Lý": "waitingStatus",
					"Thất bại": "failingStatus",
				}[data.TinhTrang]
			} w-100 rounded'>${data.TinhTrang}<span>
        </td>`)
		);
		$("tbody").append(row);
	}
	$("#pageNumber").val(currPage + 1);
}

async function getPrinterInfo() {
	try {
		await $.ajax(`http://localhost:3001/printers/${printerID}`, {
			method: "GET",
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			success: (data) => {
				printer = data;
			},
		});
	} catch (error) {
		console.log(error);
	}
}

async function updatePrinterInfo() {
	let data = {
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
		DoPhanGiai: escapeHtml($("#resolution>span").text()),
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

	let key = [
		"TocDoIn",
		"BoNho",
		"DoPhanGiai",
		"KhayGiay",
		"CongSuat",
		"TrongLuong",
		"KichThuoc",
	];
	for (let i = 0; i < preprocessedInput.length; i++) {
		data[key[i]] = preprocessedInput[i];
	}

	if (!validateInput(...preprocessedInput)) {
		showToast("failToast", "Thông tin không hợp lệ");
		return;
	}

	try {
		let id = $("#printer_id").text();
		await $.ajax(`http://localhost:3001/printers/${id}`, {
			method: "PUT",
			contentType: "application/json",
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			data: JSON.stringify(data),
		});
		await $.ajax(`http://localhost:3001/printers/${id}`, {
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			success: (data) => {
				printer = data;
			},
		});

		$("#editmode").click();
		updateInfo();
		$(".changable>input").css("color", "black");
		showToast("successToast", "Máy in đã được cập nhật thông tin");
	} catch (err) {
		console.log(err);
		showToast("failToast", "Có lỗi xảy ra");
	}
}

$(document).ready(async function () {
	printerID = new URLSearchParams(window.location.search).get("printerid");
	await getPrinterInfo();
	updateInfo();
	resetinput();

	await getPrinterHistory();
	$(".totalPrint").html(printerHistory.length);
	if (printerHistory.length)
		$(".start-day").html(
			`(tính từ ${dateProcess(
				printerHistory[printerHistory.length - 1].ThoiGian
			)})`
		);

	$("#reset").click(resetinput);

	$("#submit").click(updatePrinterInfo);

	$(".back").click(function () {
		window.location.href = "printer_management.html";
	});

	$("#editmode").click(function () {
		$(".changable>span").prop("hidden", this.checked);
		$(".change-detail").prop("hidden", !this.checked);
		$("#submit").prop("disabled", !this.checked);
		$("#reset").prop("disabled", !this.checked);
		$(".btn-check").click(function () {
			$(".btn-check").not(this).prop("checked", !this.checked);
		});
	});

	$(".form-control").change(async function () {
		$(this).css("color", "red");
	});

	$("#showPrinterHistory").click(async function () {
		$(".printer-detail").prop("hidden", true);
		$(".printer-history").removeClass("d-none").addClass("d-flex");
		try {
			currPage = 0;
			showPrinterHistory();

			$(".pagination-row").prop("hidden", false);
		} catch (err) {
			$(".pagination-row").prop("hidden", true);
			$("#export").prop("hidden", true);
		}
	});

	$("#showPrinterDetail").click(function () {
		$(".printer-history").removeClass("d-flex").addClass("d-none");
		$(".printer-detail").prop("hidden", false);
		updateInfo();
	});

	$("#nextPage").click(function () {
		currPage++;
		showPrinterHistory();
	});

	$("#previousPage").click(function () {
		currPage--;
		showPrinterHistory();
	});

	$("#gotoPage").click(async function () {
		currPage = $("#pageNumber").val();
		showPrinterHistory();
	});

	$("#pageNumber").keydown(function (e) {
		if (e.which == 13 && !$(".printer-history").is(":hidden")) {
			$("#gotoPage").click();
		}
	});
});
