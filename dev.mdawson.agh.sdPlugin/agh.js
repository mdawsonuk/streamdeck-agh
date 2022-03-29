
class AdGuardHomeAPI {
    constructor(url, https, username, password) {
        this.url = url;
        this.https = https;
        this.username = username;
        this.password = password;
    }

    testConnection() {
        this.request("status");
    }

    request(endpoint) {
        var proto = this.https ? "https://" : "http://";

        var url = proto + this.url + "/control/" + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.setRequestHeader("Authorization", "Basic " + btoa(this.username + ":" + this.password));

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                console.log(xhr.status);
                console.log(xhr.responseText);
                if (xhr.status === 200) {
                    alert("Successfully connected to AdGuard Home API");
                } else if (xhr.status === 403) {
                    alert("Error connecting to AdGuard Home API: Username or Password incorrect");
                }
            }
        };

        xhr.send();
    }
}