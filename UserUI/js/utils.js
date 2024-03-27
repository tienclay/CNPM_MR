async function requestToken() {
	try {
		await $.ajax("http://localhost:3001/auth/token", {
			method: "POST",
			beforeSend: (req) => {
				req.setRequestHeader(
					"Authorization",
					`Bearer ${Cookies.get("accessToken")}`
				);
			},
			success: function (data, status) {
				Cookies.set("accessToken", data.accessToken);
				// console.log("set token successfully");
			},
			error: function (err, status) {
				// console.log(err);
			},
			withCredentials: true,
		});
	} catch (err) {
		Cookies.remove("accessToken");
		Cookies.remove("ID");
		Cookies.remove("Ten");
		Cookies.remove("TenDangNhap");
		Cookies.remove("VaiTro");
		window.location.href = "user_login.html";
	}
}

function showToast(id, msg) {
	$(".toast-message").html(msg);
	let toast = new bootstrap.Toast($(`#${id}`));
	toast.show();
}
