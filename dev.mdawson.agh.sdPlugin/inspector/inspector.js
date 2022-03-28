var websocket = null;
var action = null;
var context = null;

// Send data over the Websocket to the Elgato Stream Deck software
function send(data) {
    websocket.send(JSON.stringify(data));
}

// called by Stream Deck when the property inspector is initialised
function connectElgatoStreamDeckSocket(inPort, inPropertyInspectorUUID, inRegisterEvent, inInfo, inActionInfo) {
    websocket = new WebSocket(`ws://127.0.0.1:${inPort}`);
    websocket.onopen = function () {
        send({
            "event": inRegisterEvent,
            "uuid": inPropertyInspectorUUID
        });
    }

    websocket.onmessage = function (evt) {
        jsonObj = json.parse(evt.data);
        let event = jsonObj.event;
    }

    let actionInfo = JSON.parse(inActionInfo);
    action = actionInfo.action;
    context = inPropertyInspectorUUID;

    let settings = actionInfo.payload.settings;
    document.querySelector("#agh-info-input").value = settings.agh_info ? settings.agh_info : "none";
    document.querySelector("#agh-url-input").value = settings.agh_url ? settings.agh_url : "";
    document.querySelector("#agh-username-input").value = settings.agh_username ? settings.agh_username : "";
    document.querySelector("#agh-password-input").value = settings.agh_password ? settings.agh_password : "";
}

function storeSettings() {
    let info = document.querySelector("#agh-info-input").value;
    let url = document.querySelector("#agh-url-input").value;
    let https = document.querySelector("#agh-https-input").checked;
    let username = document.querySelector("#agh-username-input").value;
    let password = document.querySelector("#agh-password-input").value;
    send({
        "event": "setSettings",
        "context": context,
        "payload": {
            "agh_info": info,
            "agh_url": url,
            "agh_https": https,
            "agh_username": username,
            "agh_password": password
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#agh-info-input").onchange = storeSettings;
    document.querySelector("#agh-url-input").onchange = storeSettings;
    document.querySelector("#agh-https-input").onchange = storeSettings;
    document.querySelector("#agh-username-input").onchange = storeSettings;
    document.querySelector("#agh-password-input").onchange = storeSettings;
});
