import { execa } from 'execa'
import { createSpinner } from 'nanospinner'
import yargs from 'yargs'
import { makeMonorepoPackage, spinnerColor } from './additional.js'

export async function packageCommand(args: yargs.Argv) {
	const argv = await args.argv
	const ae = argv.ae as boolean
	const jest = argv.ae as boolean
	const path = argv.path as string
	const name = argv.name as string
	const bootstrap = argv.bootstrap as boolean
	const spinner = createSpinner()
	spinner.start({
		text: 'Create package',
		color: spinnerColor,
	})
	await makeMonorepoPackage(path, ae, jest, name)
	if (bootstrap) {
		await execa('yarn', ['lerna', 'bootstrap'], { cwd: path })
	}
	spinner.success()
}
