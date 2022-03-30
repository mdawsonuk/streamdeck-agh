
// Send data over the Websocket to the Elgato Stream Deck software
function send(data) {
    websocket.send(JSON.stringify(data));
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