<p align="center">
  <a href="https://github.com/mdawsonuk/streamdeck-agh">
    <img src="https://cdn.adguard.com/public/Adguard/Common/adguard_home.svg" width="300px" alt="AdGuard Home" />
  </a>

  <h1 align="center">AdGuard Home Stream Deck Plugin</h1>
	
  <p align="center">
  <a href="LICENSE" alt="Licence">
		<img src="https://img.shields.io/github/license/mdawsonuk/streamdeck-agh?style=flat-square" /></a>
	<a href="https://github.com/mdawsonuk/streamdeck-agh/releases" alt="Releases">
		<img src="https://img.shields.io/github/v/release/mdawsonuk/streamdeck-agh?include_prereleases&style=flat-square&color=blue" /></a>
	<a href="https://github.com/mdawsonuk/streamdeck-agh/issues" alt="Issues">
		<img src="https://img.shields.io/github/issues/mdawsonuk/streamdeck-agh?style=flat-square" /></a>
	<a href="https://github.com/mdawsonuk/streamdeck-agh/releases" alt="Downloads">
		<img src="https://img.shields.io/github/downloads/mdawsonuk/streamdeck-agh/total?style=flat-square" /></a>
	<a href="https://github.com/mdawsonuk/streamdeck-agh/pulse" alt="Maintenance">
		<img src="https://img.shields.io/maintenance/yes/2022?style=flat-square" /></a>
	<a href="https://github.com/mdawsonuk/streamdeck-agh/tree/master/src/streamdeck-agh">
		<img src="https://img.shields.io/github/languages/code-size/mdawsonuk/streamdeck-agh?style=flat-square"
			alt="Repo Size"></a>
  <br />
  <p align="center">
    Monitor and Control your AdGuard Home server from your Stream Deck
    <br />
    <a href="https://github.com/mdawsonuk/streamdeck-agh/issues/new?labels=enhancement">Request a Feature</a>
    ·
    <a href="https://github.com/mdawsonuk/streamdeck-agh/issues/new?labels=bug">Report an Issue</a>
  </p>
</p>

# About this Project

This Stream Deck plugin allows you to view the statistics and control functionality of your AdGuard Home server. 

Authentication to the AdGuard Home Server is performed with a username and password. You can use an IP address or domain name with HTTP or HTTPS.

You can view the following statistics:

* DNS Queries - the number of queries made to AdGuard Home in the configured statistics rentention period
* Blocked by Filters - the number of blocked queries made to AdGuard Home
* Blocked Percentage - the percentage of queries blocked by AdGuard Home
* Blocked Malware/Phishing - the number of blocked malware/phishing queries made to AdGuard Home
* Blocked Adult Websites - the number of adult website queries blocked by AdGuard Home
* Enforced Safe Search - the number of times Safe Search was enforced in search engines through AdGuard Home
* Average Processing Time - the average processing time AdGuard Home takes to respond to a query
* Rule Count - the total number of rules loaded into AdGuard Home

You can enable or disable the following features:

* Protection - Toggles all of the below filters except for the Query Log
* Filtering - Enable or Disable blocking of domains through blocklists and filters
* Safe Browsing/Malware Block - Enable or Disable blocking of malicious domains
* Parental Controls/Adult Content Block - Enable or Disable blocking of adult content domains
* Safe Search Enforcement - Enable or disable the Safe Search 
* Query Log - Enable or Disable storing the Query Log information

Big thanks to [John Holbrook's streamdeck-pihole](https://github.com/johnholbrook/streamdeck-pihole) for providing a great project, great reading material and inspiration to understand how to create the plugin

## Contributing

### Prerequisites

You will need to install VSCode or a similar IDE to use in development.

It is recommended to [enable Javascript plugin debugging ](https://developer.elgato.com/documentation/stream-deck/sdk/create-your-own-plugin/#debugging-your-javascript-plugin) which allows you to visit [http://localhost:23654](http://localhost:23654) to use the Chrome web dev tools.

### Running Locally

You should create a symbolic link between where you are storing the repo and the Plugins directory (on Windows, it is at `%appdata%\Elgato\StreamDeck\Plugins`) for ease of development, rather than needing to copy the contents of the project over to the directory or having to do development at a fixed location.

This can be done on Windows with Command Prompt (cmd.exe) by making a directory symbolic link.

```bash
mklink /D "%appdata%\Elgato\StreamDeck\Plugins\dev.mdawson.agh.sdPlugin" "path\to\repo\streamdeck-agh\dev.mdawson.agh.sdPlugin"
```
