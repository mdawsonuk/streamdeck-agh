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

    //#region Protection

    getProtectionEnabled(callback) {
        this.request("dns_info", result => {
            callback(result.data["protection_enabled"] == true);
        });
    }

    setProtectionEnabled(currentStatus, callback) {
        if (currentStatus) {
            this.request("dns_config", result => callback(result.status === OK), "POST", { protection_enabled: false });
        } else {
            this.request("dns_config", result => callback(result.status === OK), "POST", { protection_enabled: true });
        }
    }

    //#endregion

    //#region Filtering

    getFilteringEnabled(callback) {
        this.request("filtering/status", result => {
            callback(result.data["enabled"] == true);
        });
    }

    setFilteringEnabled(currentStatus, callback) {
        if (currentStatus) {
            this.request("filtering/config", result => callback(result.status === OK), "POST", { enabled: false });
        } else {
            this.request("filtering/config", result => callback(result.status === OK), "POST", { enabled: true });
        }
    }

    //#endregion

    //#region Safe Browsing

    getSafeBrowsingEnabled(callback) {
        this.request("safebrowsing/status", result => {
            callback(result.data["enabled"] == true);
        });
    }

    setSafeBrowsingEnabled(currentStatus, callback) {
        if (currentStatus) {
            this.request("safebrowsing/disable", result => callback(result.status === OK), "POST");
        } else {
            this.request("safebrowsing/enable", result => callback(result.status === OK), "POST");
        }
    }

    //#endregion

    //#region Parental Controls

    getParentalControlsEnabled(callback) {
        this.request("parental/status", result => {
            callback(result.data["enabled"] == true);
        });
    }

    setParentalControlsEnabled(currentStatus, callback) {
        if (currentStatus) {
            this.request("parental/disable", result => callback(result.status === OK), "POST");
        } else {
            this.request("parental/enable", result => callback(result.status === OK), "POST");
        }
    }

    //#endregion

    //#region Safe Search

    getSafesearchEnabled(callback) {
        this.request("safesearch/status", result => {
            callback(result.data["enabled"] == true);
        });
    }

    setSafesearchEnabled(currentStatus, callback) {
        if (currentStatus) {
            this.request("safesearch/disable", result => callback(result.status === OK), "POST");
        } else {
            this.request("safesearch/enable", result => callback(result.status === OK), "POST");
        }
    }

    //#endregion

    //#region Query Log

    getQueryLogEnabled(callback) {
        this.request("querylog_info", result => {
            callback(result.data["enabled"] == true);
        });
    }

    setQueryLogEnabled(currentStatus, callback) {
        if (currentStatus) {
            this.request("querylog_config", result => callback(result.status === OK), "POST", { enabled: false });
        } else {
            this.request("querylog_config", result => callback(result.status === OK), "POST", { enabled: true });
        }
    }

    //#endregion

    //#region Stats

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

    getDnsQueryCount(callback) {
        this.statsRequest("num_dns_queries", (d, s) => callback(d, s));
    }

    getBlockPercentage(callback) {
        // Empty string to get all stats data returned
        this.statsRequest("", (data, status) => {
            // Avoid dividing by zero
            if (status !== OK || data === null) {
                callback(0, status);
            }
            if (data.num_blocked_filtering === 0 || data.num_dns_queries === 0) {
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

    request(endpoint, callback, method = "GET", data = null) {
        var proto = this.https ? "https://" : "http://";

        var url = proto + this.url + "/control/" + endpoint;

        var xhr = new XMLHttpRequest();
        xhr.timeout = 2000;
        xhr.open(method, url);
        // AGH now requires POST requests to set the Content-Type header
        if (method == "POST") {
            xhr.setRequestHeader("Content-Type", "application/json");
        }
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
                if (method == "GET") {
                    callback({
                        status: status,
                        data: xhr.status === 200 ? JSON.parse(xhr.response) : null
                    })
                } else if (method == "POST") {
                    callback({
                        status: status,
                        data: null
                    })
                }
            }
        };

        xhr.ontimeout = function () {
            callback({
                status: TIMEOUT,
                data: null
            })
        }

        if (data !== null) {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    }
}