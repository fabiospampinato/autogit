
# Autogit

Define commands, using plugins, to execute across all your repositories.

## Features

Autogit allows you to automate many tedious tasks, here are some practical tasks that can you can configure it to do:

- Pull/push to/from origin, across all your repositories, with one command.
- Edit multiple readmes and have autogit make the commits and pushing them, maybe even bumping the projects' versions and publishing them.
- Synchronize all your repositories' descriptions and keywords with GitHub.
- ...basically anything you want, across all, or some, of your repositories.

## Install

```sh
npm install -g autogit
```

## Usage

#### Wizard

<p align="center">
	<img src="docs/resources/demo/wizard.gif" alt="Wizard" style="width:816px">
</p>

#### Command

<p align="center">
	<img src="docs/resources/demo/github_sync.gif" alt="GitHub Sync" style="width:816px">
</p>

#### Custom Commands

You can define custom commands via the [configuration](/docs/configuration.md).

You can find most of the commands and plugins made by the community in the [awesome-autogit](https://github.com/fabiospampinato/awesome-autogit) repository.

## License

MIT © Fabio Spampinato
