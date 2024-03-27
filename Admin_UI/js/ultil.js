// Function for preprocessing input
function preprocessInput(
	speed,
	memory,
	resolution,
	capacity,
	watt,
	weight,
	shape
) {
	const units = [
		" trang/phút",
		" mb",
		" dpi",
		" tờ/khay",
		" tờ",
		" kg",
		" mm",
	];
	const inputArray = [
		speed,
		memory,
		resolution,
		capacity,
		watt,
		weight,
		shape,
	];
	for (let i = 0; i < inputArray.length; i++) {
		inputArray[i] = inputArray[i].toLowerCase();
		let unit = units[i];

		if (!inputArray[i].includes(unit)) {
			inputArray[i] += unit;
		}
		inputArray[i] = inputArray[i].replace(/\s+/g, " ").trim();
		if (i === 2 || i === 6) {
			inputArray[i] = inputArray[i]
				.replace(/x/g, " x ")
				.replace(/\s+/g, " ")
				.trim();
		}
	}
	return inputArray;
}

// Function for validation
function validateInput(
	speed,
	memory,
	resolution,
	capacity,
	watt,
	weight,
	shape
) {
	const regex1 = /^\d+ trang\/phút$/;
	const regex2 = /^\d+ mb$/;
	const regex3 = /^(\d+(\.\d+)?) x (\d+(\.\d+)?) dpi$/;
	const regex4 = /^\d+ tờ\/khay$/;
	const regex5 = /^\d+ tờ$/;
	const regex6 = /^(\d+(\.\d+)?) kg$/;
	const regex7 = /^(\d+(\.\d+)?) x (\d+(\.\d+)?) x (\d+(\.\d+)?) mm$/;

	const regexArray = [regex1, regex2, regex3, regex4, regex5, regex6, regex7];
	const processedInputArray = [
		speed,
		memory,
		resolution,
		capacity,
		watt,
		weight,
		shape,
	];
	console.log(processedInputArray);
	for (let i = 0; i < regexArray.length; i++) {
		const regex = regexArray[i];

		if (!regex.test(processedInputArray[i])) {
			return false;
		}
	}

	return true;
}

function escapeHtml(input) {
	input = input.replace(/</g, "&lt;");
	input = input.replace(/>/g, "&gt;");
	input = input.replace(/&/g, "&amp;");
	return input;
}

function showToast(id, msg) {
	$(".toast-message").html(msg);
	let toast = new bootstrap.Toast($(`#${id}`));
	toast.show();
}

function dateProcess(dateString) {
	let date = new Date(dateString);
	let dd = date.getDate();
	let mm = date.getMonth() + 1;
	let yyyy = date.getFullYear();
	if (dd < 10) dd = "0" + dd;
	if (mm < 10) mm = "0" + mm;
	return dd + "/" + mm + "/" + yyyy;
}

function timeProcess(dateString) {
	let date = new Date(dateString);
	let hh = date.getHours();
	let mm = date.getMinutes();
	let ss = date.getSeconds();
	if (hh < 10) hh = "0" + hh;
	if (mm < 10) mm = "0" + mm;
	if (ss < 10) ss = "0" + ss;
	return hh + ":" + mm + ":" + ss;
}

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
		Cookies.remove("ChucVu");
		window.location.href = "user_login.html";
	}
}
