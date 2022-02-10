import { mkdir, writeFile as _writeFile } from 'fs/promises'
import { dirname, join } from 'path'

export const eslint = (monorepo: boolean) =>
	JSON.stringify(
		{
			parser: '@typescript-eslint/parser',
			parserOptions: {
				ecmaVersion: 2021,
				sourceType: 'module',
			},
			env: {
				node: true,
			},
			extends: [
				'eslint:recommended',
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended',
				'plugin:markdown/recommended',
			],
			overrides: monorepo
				? [
						{
							files: ['./packages/*/*.md/*.js', './*.md/*.js'],
							rules: {
								'@typescript-eslint/no-var-requires': 'off',
							},
						},
				  ]
				: undefined,
			rules: {
				'@typescript-eslint/indent': [
					'error',
					4,
					{
						SwitchCase: 1,
					},
				],
				'@typescript-eslint/quotes': [
					'error',
					'single',
					{
						avoidEscape: true,
					},
				],
				'@typescript-eslint/no-unused-vars': 'error',
				'@typescript-eslint/keyword-spacing': [
					'error',
					{
						before: true,
					},
				],
				'@typescript-eslint/space-before-function-paren': [
					'error',
					{
						anonymous: 'never',
						named: 'never',
						asyncArrow: 'always',
					},
				],
				eqeqeq: 'error',
				'@typescript-eslint/space-infix-ops': 'error',
				'@typescript-eslint/comma-spacing': [
					'error',
					{
						before: false,
						after: true,
					},
				],
				'@typescript-eslint/brace-style': 'error',
				'no-multiple-empty-lines': [
					'error',
					{
						max: 1,
					},
				],
				'operator-linebreak': ['error', 'before'],
				'one-var': ['error', 'never'],
				'no-cond-assign': 'error',
				'block-spacing': 'error',
				'@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
				'comma-style': ['error', 'last'],
				'dot-location': ['error', 'property'],
				'eol-last': ['error', 'never'],
				'@typescript-eslint/func-call-spacing': ['error', 'never'],
				'key-spacing': [
					'error',
					{
						beforeColon: false,
						afterColon: true,
						mode: 'strict',
					},
				],
				'new-parens': ['error', 'always'],
				'constructor-super': 'error',
				'@typescript-eslint/no-array-constructor': 'error',
				'no-caller': 'error',
				'no-class-assign': 'error',
				'no-const-assign': 'error',
				'no-constant-condition': 'error',
				'no-debugger': 'error',
				'no-delete-var': 'error',
				'no-dupe-args': 'error',
				'@typescript-eslint/no-dupe-class-members': 'error',
				'no-dupe-keys': 'error',
				'no-duplicate-case': 'error',
				'@typescript-eslint/no-duplicate-imports': 'error',
				'no-empty-character-class': 'error',
				'no-empty-pattern': 'error',
				'no-ex-assign': 'error',
				'no-extend-native': 'error',
				'no-extra-bind': 'error',
				'no-extra-boolean-cast': 'error',
				'@typescript-eslint/no-extra-parens': 'off',
				'no-fallthrough': 'error',
				'no-func-assign': 'error',
				'no-global-assign': 'error',
				'no-implied-eval': 'error',
				'no-inner-declarations': 'error',
				'no-invalid-regexp': 'error',
				'no-irregular-whitespace': 'error',
				'no-iterator': 'error',
				'no-label-var': 'error',
				'no-labels': 'error',
				'no-lone-blocks': 'error',
				'no-mixed-spaces-and-tabs': 'error',
				'no-multi-spaces': 'error',
				'no-multi-str': 'error',
				'no-new': 'error',
				'no-new-object': 'error',
				'no-new-symbol': 'error',
				'no-new-wrappers': 'error',
				'no-obj-calls': 'error',
				'no-path-concat': 'error',
				'no-proto': 'error',
				'@typescript-eslint/no-redeclare': 'off',
				'no-regex-spaces': 'error',
				'no-return-assign': 'error',
				'no-self-assign': 'error',
				'no-self-compare': 'error',
				'no-sequences': 'error',
				'no-shadow-restricted-names': 'error',
				'no-sparse-arrays': 'error',
				'no-template-curly-in-string': 'error',
				'no-this-before-super': 'error',
				'no-throw-literal': 'error',
				'no-trailing-spaces': [
					'error',
					{
						ignoreComments: true,
					},
				],
				'no-undef-init': 'error',
				'no-unmodified-loop-condition': 'error',
				'no-unreachable': 'error',
				'no-unsafe-finally': 'error',
				'no-unsafe-negation': 'error',
				'no-useless-call': 'error',
				'no-useless-computed-key': 'error',
				'@typescript-eslint/no-useless-constructor': 'error',
				'no-useless-escape': 'error',
				'no-useless-rename': 'error',
				'no-whitespace-before-property': 'error',
				'no-with': 'error',
				'object-property-newline': 'error',
				'padded-blocks': ['error', 'never'],
				'rest-spread-spacing': 'error',
				'semi-spacing': [
					'error',
					{
						before: false,
						after: true,
					},
				],
				'space-before-blocks': 'error',
				'space-in-parens': 'error',
				'space-unary-ops': 'error',
				'template-curly-spacing': 'error',
				'use-isnan': 'error',
				'valid-typeof': 'error',
				'wrap-iife': 'error',
				'yield-star-spacing': 'error',
				yoda: 'error',
				'@typescript-eslint/semi': ['error', 'never'],
				'no-var': 'error',
				'@typescript-eslint/object-curly-spacing': ['error', 'always'],
				'array-bracket-spacing': ['error', 'always'],
				'@typescript-eslint/consistent-type-imports': 'error',
				'no-warning-comments': 'warn',
			},
		},
		null,
		2
	)

export const license = (authorName: string) => `MIT License

	Copyright (c) 2021 ${authorName}
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.`

export async function writeFile(path: string, contents: string) {
	await mkdir(dirname(path), { recursive: true })
	return await _writeFile(path, contents)
}

export const makeMonorepoPackage = async (
	path: string,
	ae: boolean,
	jest: boolean,
	name: string
) => {
	const basePath = join(path, 'packages', name)
	await writeFile(
		join(basePath, 'src', 'index.ts'),
		`export function base() { return 'base' }`
	)
	await writeFile(
		join(basePath, 'package.json'),
		JSON.stringify(
			{
				name,
				version: '0.0.1',
				description: 'An awesome package created by dai-cli',
				main: 'dist/index.js',
				typings: ae ? 'dist/base.d.ts' : 'dist/index.d.ts',
				repository: 'https://example.com',
				homepage: 'https://example.com',
				author: {
					name: 'dai-cli',
					email: 'contact@daimond113.com',
					url: 'https://www.daimond113.com',
				},
				files: ['dist', 'README.md', 'package.json'],
				license: 'MIT',
				scripts: {
					cleanup: 'rimraf dist',
					compile: `tsc -p ${jest ? 'tsconfig.prod.json' : 'tsconfig.json'}`,
					build: 'yarn cleanup && yarn compile && yarn ae',
					'build:local': 'yarn cleanup && yarn compile && yarn ae --local',
					ae: 'api-extractor run --verbose',
				},
			},
			null,
			2
		)
	)
	await writeFile(
		join(basePath, 'tsconfig.json'),
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
					sourceMap: true,
				},
			},
			null,
			2
		)
	)
	if (jest) {
		await writeFile(
			join(basePath, 'tsconfig.prod.json'),
			JSON.stringify(
				{
					extends: './tsconfig.json',
					include: ['src/**/*'],
				},
				null,
				2
			)
		)
		await writeFile(
			join(basePath, '__tests__', 'index.ts'),
			`import { base } from '../src'
		test('base', () => {
			expect(base()).toBe('base')
		})`
		)
	}
	await writeFile(join(basePath, 'LICENSE'), license('unknown'))
	await writeFile(
		join(basePath, 'README.md'),
		`# ${name}\nAn awesome package created by dai-cli`
	)
}

export const spinnerColor = 'white'
