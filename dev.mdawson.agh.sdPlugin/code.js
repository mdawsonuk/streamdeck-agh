var websocket = null;
var instances = {}
var globalSettings = null;
var adGuardHome = null;

// called by Stream Deck when the plugin is initialised
function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
    websocket = new WebSocket("ws://127.0.0.1:" + inPort);
    websocket.onopen = function () {
        // WebSocket is connected, register the plugin
        send({
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        });
        send({
            "event": "getGlobalSettings",
            "context": inPluginUUID
        });
    };

    // Handle when we get a message
    websocket.onmessage = function (evt) {
        let jsonObj = JSON.parse(evt.data);
        let event = jsonObj.event;
        let action = jsonObj.action;
        let context = jsonObj.context;

        if (event == "willAppear") {
            setupInstance(context, action, jsonObj.payload.settings);
        } else if (event == "willDisappear") {
            if ("poller" in instances[context]) {
                clearInterval(instances[context].poller);
            }
            delete instances[context];
        } else if (event == "didReceiveSettings") {
            setupInstance(context, action, jsonObj.payload.settings);
        } else if (event === "didReceiveGlobalSettings") {
            // Set global plugin settings
            globalSettings = jsonObj.payload.settings;
            // Recreate the AdGuard Home API wrapper
            adGuardHome = new AdGuardHomeAPI(
                globalSettings.agh_url,
                globalSettings.agh_https,
                globalSettings.agh_username,
                globalSettings.agh_password
            );
            // Update for each context
            for (let context in instances) {
                log("Updating instances with new global settings");
                updateStats(context);
            }
        } else if (event === "keyDown") {
            alert("Key presses are not yet implemented");
        }
    }
}

function setupInstance(context, action, settings) {
    if (!(context in instances)) {
        instances[context] = { "action": action };
    }
    instances[context].settings = settings;
    if ("poller" in instances[context]) {
        clearInterval(instances[context].poller);
    }
    // Set the timer to run based on what the user has set
    instances[context].poller = setInterval(updateStats, getInterval(settings.agh_polling_interval), context);
    updateStats(context);
    log(JSON.stringify(instances));
}

function updateStats(context) {
    if (globalSettings === null) {
        return;
    }
    switch (instances[context].settings.agh_info) {
        case "dns_queries":
            adGuardHome.getDnsQueryCount((c, s) => setTitle(context, c + "\nqueries", s));
            break;
        case "blocked_by_filters":
            adGuardHome.getFilterBlockCount((c, s) => setTitle(context, c + "\nqueries\nblocked", s))
            break;
        case "blocked_percentage":
            adGuardHome.getBlockPercentage((c, s) => setTitle(context, c + "%\nblocked", s))
            break;
        case "blocked_malicious":
            adGuardHome.getSafeBrowsingCount((c, s) => setTitle(context, c + " malicious\nqueries\nblocked", s))
            break;
        case "blocked_adult":
            adGuardHome.getFilterBlockCount((c, s) => setTitle(context, c + "\nadult sites\nblocked", s))
            break;
        case "enforced_safesearch":
            adGuardHome.getSafeSearchCount((c, s) => setTitle(context, c + "\nsafe search\nrequests\nenforced", s))
            break;
        case "avg_processing_time":
            adGuardHome.getAverageProcessingTime((c, s) => setTitle(context, c.toFixed(0) + "ms", s))
            break;
        case "rule_count":
            adGuardHome.getRuleCount((c, s) => setTitle(context, c.toLocaleString() + "\nrules", s))
            break;
        default:
            setTitle(context, "");
            break;
    }
}

function getInterval(interval) {
    // Number of ms to wait between polls to AdGuard Home
    switch (interval) {
        case "15":
            return 15000;
        case "30":
            return 30000;
        case "45":
            return 45000;
        case "90":
            return 90000;
        case "120":
            return 120000;
        case "150":
            return 150000;
        case "300":
            return 300000;
        default:
            return 60000;
    }
}

function setTitle(context, title, status) {
    switch (status) {
        default:
            send({
                "event": "setTitle",
                "context": context,
                "payload": {
                    "title": title
                }
            });
            break;
        case AUTH_ERROR:
            send({
                "event": "setTitle",
                "context": context,
                "payload": {
                    "title": "Incorrect\nCredentials"
                }
            });
            break;
        case TIMEOUT:
            send({
                "event": "setTitle",
                "context": context,
                "payload": {
                    "title": "Connection\nTimed\nOut"
                }
            });
            break;
        case NOT_FOUND:
            send({
                "event": "setTitle",
                "context": context,
                "payload": {
                    "title": "AdGuard Home\nAPI not\nfound"
                }
            });
            break;
        case UNKNOWN_ERROR:
            send({
                "event": "setTitle",
                "context": context,
                "payload": {
                    "title": "Unknown\nError\nOccured"
                }
            });
            break;
    }

}
