#!/usr/bin/env node

import { basename } from 'node:path'
import yargs from 'yargs'
import { createCommand } from './create.js'
import { packageCommand } from './package.js'

function getProcessArgvBinIndex() {
	if (isBundledElectronApp()) return 0
	return 1
}

function isBundledElectronApp() {
	return isElectronApp() && !(process as any).defaultApp
}

function isElectronApp() {
	return !!(process as any).versions.electron
}

export function hideBin(argv: string[]) {
	return argv.slice(getProcessArgvBinIndex() + 1)
}

const args = yargs(hideBin(process.argv))
args.scriptName('dai-cli')

args
	.command(
		'create [path] [name] [monorepo] [jest] [ae] [commitlint] [bootstrap]',
		'Create a new project',
		createCommand
	)
	.command(
		'package [jest] [name] [path] [ae] [bootstrap]',
		'Create a new monorepo package',
		packageCommand
	)
	.option('path', {
		default: process.cwd(),
		description: 'The path to create in',
		type: 'string',
	})
	.option('name', {
		default: basename(process.cwd()),
		description: 'The name',
		type: 'string',
	})
	.option('jest', {
		default: true,
		description: 'Whether to preconfigure jest in this project',
		type: 'boolean',
	})
	.option('ae', {
		default: true,
		description: 'Whether to preconfigure api-extractor in this project',
		type: 'boolean',
	})
	.option('monorepo', {
		default: false,
		description: 'Whether to create a monorepo or a normal project',
		type: 'boolean',
	})
	.option('commitlint', {
		default: true,
		description: 'Whether to preconfigure commitlint in this project',
		type: 'boolean',
	})
	.option('bootstrap', {
		default: true,
		description: 'Whether to bootstrap packages in a monorepo project',
		type: 'boolean',
	})
	.help()
	.parse()
