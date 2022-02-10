import ascii from 'ascii-art'
import yargs from 'yargs'
import { createSpinner } from 'nanospinner'
import chalk from 'chalk'
import { execa } from 'execa'
import { writeFile as _writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
	eslint,
	license,
	makeMonorepoPackage,
	writeFile,
	spinnerColor,
} from './additional.js'

export async function createCommand(args: yargs.Argv) {
	const mainText = chalk.bgBlue(
		chalk.whiteBright(await ascii.font('Create a project', 'doom').toPromise())
	)

	console.log(mainText)

	const argv = await args.argv
	const monorepo = argv.monorepo as boolean
	const jest = argv.jest as boolean
	const ae = argv.ae as boolean
	const commitlint = argv.commitlint as boolean
	const path = argv.path as string
	const bootstrap = argv.bootstrap as boolean
	const installedSpinner = createSpinner()
	installedSpinner.start({
		text: 'Install dependencies',
		color: spinnerColor,
	})

	const packageData = JSON.stringify(
		{
			name: argv.name,
			private: monorepo,
			version: '0.0.1',
			description: 'An awesome project created by dai-cli',
			main: 'dist/index.js',
			scripts: {
				start: 'node dist/index.js',
				build: `yarn cleanup && yarn compile ${ae ? '&& yarn ae' : ''}`,
				cleanup: monorepo ? 'lerna run rimraf dist' : 'rimraf dist',
				compile: 'tsc',
				lint: `eslint ${
					monorepo
						? 'packages/*/src/**/*.ts ./*.md packages/*/**/*.md'
						: 'src/**/*.ts ./*.md'
				}`,
				...(jest && { test: 'jest' }),
				...(ae && {
					ae: 'api-extractor --verbose',
					'build:local': 'yarn build --local',
				}),
				...(commitlint && {
					prepare: 'husky install',
				}),
			},
		},
		null,
		2
	)

	await writeFile(join(path, 'package.json'), packageData)

	const packagesArgs = [
		'@types/node',
		'eslint',
		'@typescript-eslint/eslint-plugin',
		'@typescript-eslint/parser',
		'eslint-plugin-markdown',
		'typescript',
		'rimraf',
	]

	if (monorepo) {
		packagesArgs.push('lerna')
	}
	if (jest) {
		packagesArgs.push('@types/jest', 'jest', 'ts-jest')
	}
	if (ae) {
		packagesArgs.push('@microsoft/api-extractor')
	}
	if (commitlint) {
		packagesArgs.push(
			'@commitlint/cli',
			'@commitlint/config-conventional',
			'husky'
		)
	}

	await execa('yarn', ['add', '-D', ...packagesArgs], { cwd: path })

	installedSpinner.success()

	const configSpinner = createSpinner()
	configSpinner.start({
		text: 'Create config files',
		color: spinnerColor,
	})

	await writeFile(join(path, '.eslintrc'), eslint(monorepo))
	await writeFile(
		join(path, 'tsconfig.json'),
		JSON.stringify(
			{
				compilerOptions: {
					experimentalDecorators: true,
					target: 'es6',
					module: 'CommonJS',
					moduleResolution: 'node',
					strict: true,
					esModuleInterop: true,
					skipLibCheck: true,
					forceConsistentCasingInFileNames: true,
					declaration: true,
					declarationMap: true,
					outDir: 'dist',
					resolveJsonModule: true,
					allowJs: true,
				},
			},
			null,
			2
		)
	)
	const gitIgnore = ['node_modules', 'dist', 'yarn-error.log']
	if (monorepo) gitIgnore.push('lerna-debug.log')
	await writeFile(join(path, '.gitignore'), gitIgnore.join('\n'))

	const eslintIgnore = ['dist', 'node_modules']

	if (monorepo) {
		await writeFile(
			join(path, 'lerna.json'),
			JSON.stringify(
				{
					npmClient: 'yarn',
					packages: ['packages/*'],
					version: 'independent',
					command: {
						publish: {
							message: 'chore(release): publish',
						},
					},
				},
				null,
				2
			)
		)
		eslintIgnore.push('temp')
		eslintIgnore.push('etc')
	}

	await writeFile(join(path, '.eslintignore'), eslintIgnore.join('\n'))

	if (jest) {
		await execa('yarn', ['ts-jest', 'config:init'], { cwd: path })
	}

	if (ae) {
		await execa('yarn', ['api-extractor', 'init'], { cwd: path })
	}

	configSpinner.success()

	const directorySpinner = createSpinner()
	directorySpinner.start({
		text: 'Create directory structure',
		color: spinnerColor,
	})
	if (monorepo) {
	} else {
		writeFile(
			join(path, 'src', 'index.ts'),
			`export function base() { return 'base' }`
		)
		if (jest) {
			writeFile(
				join(path, '__tests__', 'index.ts'),
				`import { base } from '../src'
			test('base', () => {
				expect(base()).toBe('base')
			})`
			)
		}
	}
	directorySpinner.success()
	const additionalFilesSpinner = createSpinner()
	additionalFilesSpinner.start({
		text: `Create additional files ${
			bootstrap ? 'and bootstrap packages' : ''
		}`,
		color: spinnerColor,
	})
	await writeFile(join(path, 'README.md'), '# dai-cli')
	await writeFile(join(path, 'LICENSE'), license('unknown'))
	if (monorepo) {
		await makeMonorepoPackage(path, ae, jest, 'base')
		if (bootstrap) {
			await execa('yarn', ['lerna', 'bootstrap'], { cwd: path })
		}
	}
	additionalFilesSpinner.success()
}
