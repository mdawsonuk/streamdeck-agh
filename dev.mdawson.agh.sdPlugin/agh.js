const OK = 0;
const AUTH_ERROR = 1;
const TIMEOUT = 2;
const NOT_FOUND = 4;
const UNKNOWN_ERROR = 256;

class AdGuardHomeAPI {
    constructor(url, https, username, password) {
        this.url = url;
        this.https = https;
        this.username = username;
        this.password = password;
    }

    testConnection(callback) {
        this.request("status", result => {
            callback(result.status);
        });
    }

    getRuleCount(callback) {
        this.request("filtering/status", (response, status) => {
            let count = 0;
            for (let index in response.data.filters) {
                if (response.data.filters[index].enabled) {
                    count += response.data.filters[index].rules_count;
                }
            }
            callback(count, status);
        })
    }

    //#region Stats

    getDnsQueryCount(callback) {
        this.statsRequest("num_dns_queries", (d, s) => callback(d, s));
    }

    getBlockPercentage(callback) {
        // Empty string to get all stats data returned
        this.statsRequest("", (data, status) => {
            // Avoid dividing by zero
            log(status);
            if (status !== OK || data === null) {
                callback(0, status);
            }
            if (data.num_dns_queries === 0) {
                callback(0, status);
            }
            callback((data.num_blocked_filtering / data.num_dns_queries * 100).toFixed(2), status);
        });
    }

    getFilterBlockCount(callback) {
        this.statsRequest("num_blocked_filtering", (d, s) => callback(d, s));
    }

    getSafeBrowsingCount(callback) {
        this.statsRequest("num_replaced_safebrowsing", (d, s) => callback(d, s));
    }

    getSafeSearchCount(callback) {
        this.statsRequest("num_replaced_safesearch", (d, s) => callback(d, s));
    }

    getParentalFilterCount(callback) {
        this.statsRequest("num_replaced_parental", (d, s) => callback(d, s));
    }

    getAverageProcessingTime(callback) {
        this.statsRequest("avg_processing_time", (d, s) => callback(d * 1000, s));
    }

    statsRequest(stat, callback) {
        this.request("stats", (result, status) => {
            if (stat !== "") {
                callback(result.data !== null ? result.data[stat] : null, result.status);
            } else {
                callback(result.data, result.status);
            }
        });
    }

    //#endregion

    request(endpoint, callback) {
        var proto = this.https ? "https://" : "http://";

        var url = proto + this.url + "/control/" + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.timeout = 2000;
        xhr.open("GET", url);

        xhr.setRequestHeader("Authorization", "Basic " + btoa(this.username + ":" + this.password));

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let status = OK;
                switch (xhr.status) {
                    case 200:
                        break;
                    case 403:
                        status = AUTH_ERROR;
                    case 404:
                        status = NOT_FOUND;
                    default:
                        status = UNKNOWN_ERROR;
                        break;
                }
                callback({
                    status: status,
                    data: xhr.status === 200 ? JSON.parse(xhr.response) : null
                })
            }
        };

        xhr.ontimeout = function () {
            callback({
                status: TIMEOUT,
                data: null
            })
        }

        xhr.send();
    }
}