async function updateInfo(res) {
	$("#firm-name").html(res.Hang);
	$("#printer_id").html(res.ID);
	$("#printer_model").html(res.Model);
	$("#location>span").html(res.ViTri);
	$("#status>span").html(
		res.TinhTrang == "Working" ? "Kích hoạt" : "Vô hiệu hóa"
	);
	$("#type_printer>span").html(res.Kieu);
	$("#speed>span").html(res.TocDoIn);
	$("#memory>span").html(res.BoNho);
	$("#shape>span").html(res.KichThuoc);
	$("#capacity>span").html(res.KhayGiay);
	$("#ink>span").html(res.LoaiMuc);
	$("#watt>span").html(res.CongSuat);
	$("#support_color>span").html(res.InMau ? "Có" : "Không");
	$("#weight>span").html(res.TrongLuong);
}
$(document).ready(async function () {
	if (!Cookies.get("accessToken")) {
		window.location.href = "user_login.html";
	}
	let printerID = await new URLSearchParams(window.location.search).get(
		"printerid"
	);
	console.log(printerID);
	let res;
	try {
		await $.ajax({
			url: `http://localhost:3001/printers/${printerID}`,
			method: "GET",
			beforeSend: function (request) {
				request.setRequestHeader(
					"authorization",
					"Bearer: " + Cookies.get("accessToken")
				);
			},
			success: async function (result, status, xhr) {
				res = await result;
			},
			error: async function (result, status, xhr) {
				console.log(result);
				console.log(status);
				console.log(xhr);
			},
		});
	} catch {}
	console.log(res);
	await updateInfo(res);
});
