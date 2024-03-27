let printed = [];

async function getPrintedDocument() {
	let res = [];
	try {
		await $.ajax({
			url: `http://localhost:3001/printing/done/${Cookies.get("ID")}`,
			method: "GET",
			beforeSend: function (req) {
				req.setRequestHeader(
					"Authorization",
					"Bearer: " + Cookies.get("accessToken")
				);
			},
			success: async function (result, status, xhr) {
				res = result;
			},
			error: async function (result, status, xhr) {
				console.log(result);
				console.log(status);
				console.log(xhr);
			},
		});
	} catch (err) {
		await requestToken();
		return getPrintedDocument();
	}
	return res;
}

async function viewQr(id) {
	let start = printed[id]["QRCode"].indexOf("/file/d/") + 8;
	let end = printed[id]["QRCode"].indexOf("/", start);
	let qrId = printed[id]["QRCode"].slice(start, end);

	$(".document").removeClass("bg-secondary");
	$(`#document-${id}`).addClass("bg-secondary");

	// $("#qr-box").attr("src", printed[id]["QRCode"]);
	$("#qr-box img").attr(
		"src",
		`https://drive.google.com/uc?export=view&id=${qrId}`
	);
}

async function getMenuContent() {
	printed = await getPrintedDocument();
	let text =
		printed
			.map((data, index) => {
				return `
			<div class="document p-1" id="document-${index}" onclick="viewQr(${index})">
				${data["TenTaiLieu"]}
			</div>`;
			})
			.join("") ||
		`<div class="text-secondary align-self-center">Không có tài liệu</div>`;

	return `
		<div class="container-fluid px-0 shadow">
			<nav class="navbar navbar-light bg-light">
				<a class="navbar-brand" href="user_home.html">
					<img src="./images/header/icon.svg" />
					<span class="mainname col-md-2">SPSS</span>
				</a>
				<div class="col-md-6 center-nav d-flex justify-content-around align-items-center">
					<button 
						type="button"
						class="link-qr btn"
						data-bs-toggle="modal"
						data-bs-target="#QrModal"
					>
						<img class="qr-icon" src="./images/user_home/QRicon.png" alt="" />
					</button>

					<a class="link-print in" href="user_service.html">
						<img src="./images/header/service.svg" />
					</a>

					<a class="link-queue" href="./user_queue.html">
						<span class="text-queue">Hàng đợi</span>
					</a>

					<a class="link-history" href="./user_history.html">
						<span class="text-history">Lịch sử</span>
					</a>
				</div>

				<div class="col-md-3 account">
					${getAccountBar()} 
				</div>
			</nav>
		</div>
			
<div class="modal fade" id="QrModal" tabindex="-1" aria-labelledby="QrModalLabel" aria-hidden="true">
	<div
		class="modal-dialog modal-dialog-centered Montserrat"
		style="transform:scale(1.2);"
	>
		<div
			class="modal-content row flex-row"
			style="border-radius:10px; overflow:hidden"
		>

				<div class="col-5 d-flex flex-column px-2 pt-1">
					<div class="">
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="align-self-center theme-color my-2" style="font-size:1.2em;">
						Tài liệu đã được in
					</div>
					${text}
				</div>


				<div
					class="col-7 bg-primary d-flex align-items-center justify-content-center"
					style="aspect-ratio:1/1; border-radius:6px;"
				>
					<div
						id="qr-box"
						style="width:75%; aspect-ratio:1/1;"
					>
						<div
							class="bg-light w-100 h-100"
						>
							<img class="w-100" src=""/>
						</div>
					</div>
				</div>
			
		</div>
	</div>
</div>`;
}

function getUsername() {
	return Cookies.get("Ten");
}

function getMSSV() {
	return Cookies.get("ID");
}

function getAccountBar() {
	return `
		<div class="login_acc">
			<div class="img-message">
				<button class="btn-message bg-transparent border-0">
					<img class="img-msg"
						src="./images/user_home/message.png"
						width="30px"
						height="30px"
						alt=""
					/>
				</button>
			</div>

			<div class="img-noti">
				<button class="btn-noti bg-transparent border-0">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="30"
					height="30"
					viewBox="0 0 37 37"
					fill="none"
				>
					<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M13.9461 33.7131C14.8623 34.6806 16.0386 35.2121 17.259 35.2121H17.2608C18.4866 35.2121 19.6681 34.6806 20.5861 33.7114C21.0779 33.1966 21.9163 33.1547 22.4593 33.6192C23.0041 34.0836 23.0483 34.8801 22.5583 35.3949C21.1291 36.8989 19.2489 37.7273 17.2608 37.7273H17.2573C15.2745 37.7256 13.3978 36.8973 11.9739 35.3932C11.4839 34.8784 11.5282 34.082 12.0729 33.6192C12.6177 33.153 13.4561 33.195 13.9461 33.7131ZM17.3471 1.67676C25.2094 1.67676 30.491 7.48173 30.491 12.9027C30.491 15.6912 31.2392 16.8733 32.0334 18.1275C32.8187 19.365 33.7084 20.7701 33.7084 23.4261C33.0911 30.212 25.618 30.7653 17.3471 30.7653C9.07627 30.7653 1.60137 30.212 0.991112 23.5334C0.98583 20.7701 1.87553 19.365 2.66087 18.1275L2.93812 17.6851C3.62075 16.5729 4.20326 15.3631 4.20326 12.9027C4.20326 7.48173 9.48486 1.67676 17.3471 1.67676ZM17.3471 4.19191C11.1652 4.19191 6.85644 8.7829 6.85644 12.9027C6.85644 16.3887 5.83585 18.0001 4.93377 19.422C4.21033 20.5639 3.63901 21.466 3.63901 23.4261C3.9344 26.5885 6.13654 28.2502 17.3471 28.2502C28.4958 28.2502 30.7669 26.5147 31.0605 23.3171C31.0552 21.466 30.4839 20.5639 29.7605 19.422C28.8584 18.0001 27.8378 16.3887 27.8378 12.9027C27.8378 8.7829 23.529 4.19191 17.3471 4.19191Z"
					fill="#0D0D0D"
					/>
					<path
					d="M28.4019 12.3662C31.6478 12.3662 34.3371 9.86372 34.3371 6.70706C34.3371 3.5504 31.6478 1.04797 28.4019 1.04797C25.1561 1.04797 22.4668 3.5504 22.4668 6.70706C22.4668 9.86372 25.1561 12.3662 28.4019 12.3662Z"
					fill="#F74A4A"
					stroke="#FEFEFE"
					stroke-width="1.25758"
					/>
				</svg>
				</button>
			</div>

			<div class="home-username">
				<b>${getUsername()}</b>	
			</div>

			<span>&#124;</span>

			<div class="home-mssv">
				${getMSSV()}
			</div>
			<button class="logout bg-transparent border-0" onclick="logout()">
				<i class="fa-solid fa-right-from-bracket"></i>
			</button>
		</div>`;
}

function logout() {
	Cookies.remove("accessToken");
	Cookies.remove("Ten");
	Cookies.remove("TenDangNhap");
	Cookies.remove("ID");
	Cookies.remove("VaiTro");
	window.location.href = "user_login.html";
}
