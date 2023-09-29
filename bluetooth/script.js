function OnLoad() {
	getallconnected()
}

function getallconnected() {
	guiEvent("getallconnected", "")
}

function CreateTR(isth, params) {
	var tr = document.createElement("tr")
	if (isth) {
		let len = params.length
		for (let index = 0; index < len; index++) {
			let element = params[index];
			var th = document.createElement("th")
			if (element instanceof Element) {
				th.appendChild(element)
			} else if (typeof (element) === 'string') {
				th.innerText = element.toString()
			}
			tr.appendChild(th)

		}

	} else {
		let len = params.length
		for (let index = 0; index < len; index++) {
			let element = params[index];
			var td = document.createElement("td")
			if (element instanceof Element) {
				td.appendChild(element)
			} else if (typeof (element) === 'string') {
				td.innerText = element.toString()
			}
			tr.appendChild(td)
		}
	}
	return tr
}
function updateTableDevices(devices) {
	let allmacs = document.getElementById("allmacs")
	allmacs.innerHTML = ""
	let len = devices.length
	allmacs.appendChild(CreateTR(true, ["MAC Address", "Device Name", ""]))
	for (let i = 0; i < len; i++) {
		var current = devices[i]
		var btn = document.createElement("button")
		btn.innerText = "..."
		btn.onclick = function(ev) {
			var deviceName = btn.getAttribute("devicename")
			let filename = document.getElementById("filename").value
			if (confirm("Desejar enviar o arquivo? " + filename)) {
				guiEvent("sendfile", [filename, deviceName])
			}
			

		}
		btn.setAttribute("devicename",current.deviceName)
		allmacs.appendChild(CreateTR(false, [
			current.macAddress,
			current.deviceName,
			btn
		]))
	}
}
function update(type, args) {
	if (type == "getallconnected") {
		updateTableDevices(args)
	}
}
