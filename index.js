const { execSync } = require('child_process');
const chalk = require('chalk');

module.exports = (filePath, options) => {
	const optionsObj = typeof filePath === 'object' ? filePath : options;
	const path = typeof filePath === 'string' ? filePath : process.cwd();

	const providedDirExclusions = optionsObj.exclude || [];

	const dirExclusions = [
		'node_modules',
		'flow-typed',
		'.idea',
		'.vscode',
		'.git',
		...providedDirExclusions,
	];
	const baseCmd = [
		'grep',
		'-R',
		`--exclude-dir={${dirExclusions.join(',')}}`,
	];

	const searchCmd = [
		`'TODO'`,
		path,
		'| wc -l',
	];

	if (optionsObj.fileTypes && optionsObj.fileTypes.length) {
		const exclusions = optionsObj.fileTypes.map((e) => e.replace('.', '')).join(',');
		baseCmd.push(`--exclude=\\*.{${exclusions}}`);
	}

	const cmd = ([...baseCmd, ...searchCmd]).join(' ');

	if (optionsObj.verbose) {
		console.log(chalk.gray(cmd));
	}

	const resultBuffer = execSync(cmd);
	const resultRaw = resultBuffer && resultBuffer.toString();

	if (!resultRaw) {
		return 0;
	} else {
		return parseInt(resultRaw.trim(), 10);
	}
};
