// $(document).load(function () {});

$(document).ready(async function () {
	$("#headerbar").html(await getMenuContent());

	$(".btn-pr").click(function () {
		location.href = "./user_service.html";
	});

	if (localStorage.getItem("printSuccess")) {
		showToast("successToast", "Bạn đã đăng ký in thành công");
		localStorage.removeItem("printSuccess");
	}
});
