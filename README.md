# JSUI

Made by [Kitze](https://twitter.com/thekitze)

--
A tool for visually organizing, creating, and managing JavaScript projects.   
It doesn't matter if it's frontend or a backend app, or what framework it's using. If it has a `package.json`, it belongs here.


# Features

---

## Organize
- Import existing projects from your computer
- Manage and organize projects in groups
- Collapse, rename, or delete groups
- Mark a project with a red border if it's not using Git yet

![JSUI](https://i.imgur.com/tDHfoRV.png)

## Quick actions
- Open the project in Finder
- Open the project in your editor of choice (configurable in Settings)
- Quick preview of package.json
- Start the project
- Remove the project from the dashboard

## Search
- Easily search all of your projects by pressing `Cmd + Shift + P`
- Choosing a project will navigate to the project dashboard
- Expect more Alfred-like functionality soon

![](https://i.imgur.com/XwYX8EE.gif)

## Generate an app
- Generate a new app using a popular cli
- Supports React, Vue, Angular, Gatsby, React Native, Expo, etc.
- Configure advanced options for each generator

![generate project](https://i.imgur.com/Bxdh1oA.gif)

## Kill a port

- For times when something annoying is running on a port and the process just can't be killed


![kill a port](https://i.imgur.com/OvrnaFU.gif)

---

##Project dashboard

![project dashboard](https://i.imgur.com/UPJOmcC.png)
### Files
> Note: This feature must be enabled from the Settings first

- Index and display a list of all of the folders and files in a project
- Click a file to quickly preview it
- Press `Cmd + Shift + N` to quickly navigate and preview a file

![files](https://i.imgur.com/gXPw73X.gif)

### Run scripts
- See a list of all the scripts and run them with a press of a button
- Run multiple scripts at once
- The scripts run in an integrated Terminal that supports multiple tabs so you can see the output, or you can minimize it if you don't care

![scripts](https://i.imgur.com/bdtrVK4.gif)

## Dependencies
- See two separate lists of the project dependencies and dev dependencies
- Easily install a dependency and specify a version
- Move a dependency to dev dependencies and vice-versa
- Update the version of a dependency to the latest version

![dependencies](https://i.imgur.com/LxQe2mf.gif)

## Plugins
- Plugins have the ability to install new dependencies, remove dependencies, modify scripts, remove, and add new files to a project
- Right now the following plugins are available:
	- **Storybook**: Installs storybook and adds the needed files to the project
	- **Plop**: Adds the `plop` generator to the project. It also adds a default `plop-templates` folder, a `plopfile.js`.
	- **Add .env**: Adds an `.env` file to the project. Soon this file will be editable through UI.
	- **Rewire**: Installs `react-app-rewired` and adds a default `config-overrides.js` file

> Note: plugins will be separated from the repo soon so anyone can publish their own plugin	

![plugins](https://i.imgur.com/sgiFoWi.gif)
	
## Generate files
- Automatically detect a `plopfile.js` and quickly generate files from existing templates.

![](https://i.imgur.com/pm9ugjK.gif)


