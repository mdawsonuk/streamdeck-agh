var websocket = null;
var instances = {}

// called by Stream Deck when the plugin is initialised
function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo){
    websocket = new WebSocket("ws://127.0.0.1:" + inPort);
    websocket.onopen = function(){
        // WebSocket is connected, register the plugin
        var json = {
            "event": inRegisterEvent,
            "uuid": inPluginUUID
        };
        websocket.send(JSON.stringify(json));
    };

    // Handle when we get a message
    websocket.onmessage = function(evt){
        // TODO
    }
}