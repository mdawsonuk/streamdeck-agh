var websocket = null;
var action = null;
var context = null;
var globalSettings = {};

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
        send({
            "event": "getGlobalSettings",
            "context": inPropertyInspectorUUID
        });
    };

    websocket.onmessage = function (evt) {
        jsonObj = JSON.parse(evt.data);
        let event = jsonObj.event;
        let jsonPayload = jsonObj.payload;

        if (event === 'didReceiveGlobalSettings') {
            // Set global plugin settings
            globalSettings = jsonPayload.settings;

            document.querySelector("#agh-url-input").value = globalSettings.agh_url ? globalSettings.agh_url : "";
            document.querySelector("#agh-https-input").checked = globalSettings.agh_https ? globalSettings.agh_https : false;
            document.querySelector("#agh-username-input").value = globalSettings.agh_username ? globalSettings.agh_username : "";
            document.querySelector("#agh-password-input").value = globalSettings.agh_password ? globalSettings.agh_password : "";
        }
    };

    let actionInfo = JSON.parse(inActionInfo);
    action = actionInfo.action;
    context = inPropertyInspectorUUID;

    let settings = actionInfo.payload.settings;
    document.querySelector("#agh-info-input").value = settings.agh_info ? settings.agh_info : "none";
    document.querySelector("#agh-polling-input").value = settings.agh_polling_interval ? settings.agh_polling_interval : "60";
}

function storeSettings() {
    let info = document.querySelector("#agh-info-input").value;
    let polling = document.querySelector("#agh-polling-input").value;
    send({
        "event": "setSettings",
        "context": context,
        "payload": {
            "agh_info": info,
            "agh_polling_interval": polling
        }
    });
}

function storeGlobalSettings() {
    globalSettings.agh_url = document.querySelector("#agh-url-input").value;
    globalSettings.agh_https = document.querySelector("#agh-https-input").checked;
    globalSettings.agh_username = document.querySelector("#agh-username-input").value;
    globalSettings.agh_password = document.querySelector("#agh-password-input").value;
    send({
        "event": "setGlobalSettings",
        "context": context,
        "payload": {
            "agh_url": globalSettings.agh_url,
            "agh_https": globalSettings.agh_https,
            "agh_username": globalSettings.agh_username,
            "agh_password": globalSettings.agh_password
        }
    });
}

// Log to the global log file
function log(inMessage) {
    // Log to the developer console
    let time = new Date();
    let timeString = time.toLocaleDateString() + ' ' + time.toLocaleTimeString();
    console.log(timeString, inMessage);

    // Log to the Stream Deck log file
    if (websocket) {
        websocket.send(JSON.stringify({
            event: 'logMessage',
            payload: {
                message: inMessage,
            },
        }));
    }
}

function testApi() {
    let status = document.querySelector("#agh-connection-status");
    let agh = new AdGuardHomeAPI(
        globalSettings.agh_url,
        globalSettings.agh_https,
        globalSettings.agh_username,
        globalSettings.agh_password
    );
    status.innerHTML = "";
    agh.testConnection((auth, timeout) => {
        if (timeout) {
            status.innerHTML = "Request timed out";
            status.style.color = "yellow";
        } else {
            if (auth) {
                status.innerHTML = "Success!";
                status.style.color = "green";
            } else {
                status.innerHTML = "Incorrect credentials";
                status.style.color = "red";
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#agh-info-input").onchange = storeSettings;
    document.querySelector("#agh-polling-input").onchange = storeSettings;

    document.querySelector("#agh-url-input").onchange = storeGlobalSettings;
    document.querySelector("#agh-https-input").onchange = storeGlobalSettings;
    document.querySelector("#agh-username-input").onchange = storeGlobalSettings;
    document.querySelector("#agh-password-input").onchange = storeGlobalSettings;

    document.querySelector("#agh-test-api-button").onclick = testApi;
});
