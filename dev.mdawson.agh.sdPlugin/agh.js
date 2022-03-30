
class AdGuardHomeAPI {
    constructor(url, https, username, password) {
        this.url = url;
        this.https = https;
        this.username = username;
        this.password = password;
    }

    testConnection() {
        this.request("status", result => {
            if (result.status === 200) {
                alert("Successfully connected to AdGuard Home API");
            } else if (result.status === 403) {
                alert("Error connecting to AdGuard Home API: Username or Password incorrect");
            }
        });
    }

    //#region Stats

    getDnsQueryCount(callback) {
        this.statsRequest("num_dns_queries", d => callback(d));
    }

    getBlockPercentage(callback) {
        this.statsRequest("", data => {
            // Avoid dividing by zero
            if (data.num_dns_queries === 0) {
                callback(0);
            }
            callback((data.num_blocked_filtering / data.num_dns_queries * 100).toFixed(2));
        });
    }

    getFilterBlockCount(callback) {
        this.statsRequest("num_blocked_filtering", d => callback(d));
    }

    getSafeBrowsingCount(callback) {
        this.statsRequest("num_replaced_safebrowsing", d => callback(d));
    }

    getSafeSearchCount(callback) {
        this.statsRequest("num_replaced_safesearch", d => callback(d));
    }

    getParentalFilterCount(callback) {
        this.statsRequest("num_replaced_parental", d => callback(d));
    }

    getAverageProcessingTime(callback) {
        this.statsRequest("avg_processing_time", d => callback(d * 1000));
    }

    statsRequest(stat, callback) {
        this.request("stats", result => {
            if (stat !== "") {
                callback(result.data[stat]);
            } else {
                callback(result.data);
            }
        });
    }

    //#endregion

    request(endpoint, callback) {
        var proto = this.https ? "https://" : "http://";

        var url = proto + this.url + "/control/" + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.setRequestHeader("Authorization", "Basic " + btoa(this.username + ":" + this.password));

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback({
                    status: xhr.status,
                    data: JSON.parse(xhr.response)
                })
            }
        };

        xhr.send();
    }
}