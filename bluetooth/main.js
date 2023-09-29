
var dstService = "{33c916ee-8f73-4974-b5f7-ee6c47f5a566}";
var service;
var clifileok = false

Bluetooth.getDeviceName = function (name) {
    var alldevices = this.getConnectedDevices();
    for (var v in alldevices) {
        var current = alldevices[v]
        if (current.deviceName == name) {
            return current
        }
    }
    return undefined
}
function Bluetooth_SendFile(filename, devicename) {
    var device = Bluetooth.getDeviceName(devicename)
    if (FileSystem.exists(filename) && device) {
        var file = FileSystem.open(filename, File.READ);
        var data = ""
        while (file.available() > 0) {
            data += file.readln()
        }
        file.close()
        var objdata = {
            "type": "fileshare",
            "filename": filename,
            "datafile": data
        }
        service.send(device.macAddress, dstService, JSON.stringify(objdata));
    }
}

function setup() {
    Bluetooth.init()
    service = new BluetoothService();
    service.onReceive = function (srcMac, srcService, dstMac, dstService, data) {
        var json = JSON.parse(data)
        var type = json["type"]
        if (type == "fileshare") {
            var filename = json["filename"]
            var datafile = json["datafile"]
            var file = FileSystem.open(filename, File.WRITE);
            file.print(datafile)
            file.close()

            return;
        }




    };
    service.start(dstService)
    GUI.setup();

    CLI.setup();
    // fsbt Smartphone2 "abc.txt"
}

function guiEvent(type, args) {
    if (type == "getallconnected") {
        GUI.update(type, Bluetooth.getConnectedDevices())
        return
    }
    if (type == "sendfile") {
        Bluetooth_SendFile(args[0],args[1])
        

    }
}

function cliEvent(type, args) {

    var len = args.length
    if (type == "invoked") {
        if (len >= 2) {
            if (args[0] == "fsbt") {
                if (len == 4 && args[1] == "send") {
                    var devicename = args[2]
                    var filename = args[3]
                    Bluetooth_SendFile(filename,devicename)
                    
                } else if (len == 2 && args[1] == "allconnected") {
                    var allconnected = Bluetooth.getConnectedDevices()
                    var allconnectedlen = allconnected.length
                    for (var index = 0; index < allconnectedlen; index++) {
                        var element = allconnected[index];
                        console.log(element.deviceName, " ", element.macAddress)
                    }
                }
            }
        }
    }
    CLI.exit();
}
