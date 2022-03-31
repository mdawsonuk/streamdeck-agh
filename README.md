<p align="center">
  <a href="https://github.com/mdawsonuk/streamdeck-agh">
    <img src="https://cdn.adguard.com/public/Adguard/Common/adguard_home.svg" width="300px" alt="AdGuard Home" />
  </a>

  <h1 align="center">AdGuard Home Stream Deck Plugin</h1>
	
  <p align="center">
  <a href="LICENSE" alt="License">
    <img src="https://img.shields.io/github/license/mdawsonuk/streamdeck-agh?style=flat-square" /></a>
  <a href="https://github.com/mdawsonuk/streamdeck-agh/graphs/contributors" alt="Contributors">
    <img src="https://img.shields.io/github/contributors/mdawsonuk/streamdeck-agh?style=flat-square" /></a>
  <a href="https://github.com/mdawsonuk/streamdeck-agh/pulls?q=is%3Apr+is%3Aclosed" alt="Closed PRs">
    <img src="https://img.shields.io/github/issues-pr-closed/mdawsonuk/streamdeck-agh?style=flat-square" /></a>
  <a href="https://github.com/mdawsonuk/streamdeck-agh/network/members/" alt="Forks">
    <img src="https://img.shields.io/github/forks/mdawsonuk/streamdeck-agh?style=flat-square" /></a>
  <a href="https://github.com/mdawsonuk/streamdeck-agh/stargazers/" alt="Stars">
    <img src="https://img.shields.io/github/stars/mdawsonuk/streamdeck-agh?style=flat-square" /></a>
  <br />
  <p align="center">
    Monitor and Control your AdGuard Home server from your Stream Deck
    <br />
    <a href="https://github.com/mdawsonuk/streamdeck-agh/issues/new?labels=enhancement">Request a Feature</a>
    ·
    <a href="https://github.com/mdawsonuk/streamdeck-agh/issues/new?labels=bug">Report an Issue</a>
  </p>
</p>

Big thanks to [John Holbrook's streamdeck-pihole](https://github.com/johnholbrook/streamdeck-pihole) for providing a great project, great reading material and inspiration to understand how to create the plugin

## Contributing

You should create a symbolic link between where you are storing the repo and the Plugins directory (on Windows, it is at `%appdata%\Elgato\StreamDeck\Plugins`)

This can be done with Windows Command Prompt (cmd.exe) by making a directory symbolic link.

```bash
mklink /D "%appdata%\Elgato\StreamDeck\Plugins\dev.mdawson.agh.sdPlugin" "path\to\repo\streamdeck-agh\dev.mdawson.agh.sdPlugin"
```
