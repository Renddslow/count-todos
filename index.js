const { execSync } = require('child_process');
const exec = require('child_process').exec;
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
		'-Ry',
		`--exclude-dir={${dirExclusions.join(',')}}`,
	];

	const searchCmd = [
		`'todo:\\s'`,
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
	var diff = [];
	const resultBuffer = execSync(cmd);
	const other_cmd = "grep -inRw -E 'TODO' . --exclude-dir={node_modules,test}"
	const foo = function(cb){
		exec(other_cmd, (err, stdout, stderr) => {
			if (err) {
				console.error(`exec error: ${err}`);
				return cb(err);
			}
			cb(null, {stdout,stderr});
		});
	}

	foo(function(err, {stdout,stderr}) {
		if (err) {
			console.log("ERROR in foo");
			return;
		} 
		const dates = stdout.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{2}/g);
		dates.forEach((date) => {
			var oneDay = 24*60*60*1000;
			var newDate = new Date(date);
			const today = new Date();
			diff.push(Math.round(Math.abs((newDate.getTime() - today.getTime())/(oneDay))));
		});
		const reducer = (accumulator, currentValue) => accumulator + currentValue;
		const average = diff.reduce(reducer) / diff.length;
		console.log(`Average age of TODO: ${average}`);
 });

	const resultRaw = resultBuffer && resultBuffer.toString();

	if (!resultRaw) {
		return 0;
	} else {
		return parseInt(resultRaw.trim(), 10);
	}
};
