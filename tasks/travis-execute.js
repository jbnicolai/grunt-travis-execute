'use strict';

module.exports = function (grunt) {
	grunt.registerTask('travisExecute', 'run travis', function () {
		var options = this.options({
      travis: './.travis.yml',
			stdout: true,
			stderr: true,
			stdin: true,
			failOnError: true
    });
		var done = this.async();
		var flags = this.flags;

    var travisJSON = require('yamljs').load(options.travis);
		var scripts = [
		'before_install',
		'install',
		'before_script',
		'script',
		'after_script'];

		var hasFlags = scripts.some(function(execute_name){
			return flags[execute_name] === true;
		});
		if(!hasFlags){
			scripts.forEach(function(execute_name){
				flags[execute_name] = true;
			});
		}
		var s = shell();
    scripts.forEach(function(execute_name){
			if(flags[execute_name]){
				var cmds = travisJSON[execute_name];
				if(typeof cmds !== 'undefined' && typeof cmds.join === 'function'){
					s.excute(cmds.join('&&'), options);
				}else if(execute_name === 'script'){
					s.excute('npm test', options);
				}
			}
    }, this);
		s.done(done);
	});

	function shell(){

		var exec = require('child_process').exec
			, chalk = require('chalk')
			, shellStacks = []
			, executeAllowed = false
			, executing = false
			, doneFn;

		return {
			done: done,
			excute: excute
		};

		function done(d){
			doneFn = d;
			executeAllowed = true;
			_execute();
		}

		function excute(cmd, options){
			if(!executeAllowed || executing){
				shellStacks.push(arguments);
				return;
			}

			executing = true;

			cmd = grunt.template.process(typeof cmd === 'function' ? cmd.apply(grunt, arguments) : cmd);

			console.log(cmd+': start');
			var cp = exec(cmd, options.execOptions, function (err, stdout, stderr) {
				executing = false;
				console.log(cmd+': complate');
				if (stderr && options.failOnError) {
					grunt.warn(stderr);
				}
				_execute();
			});

			var captureOutput = function (child, output) {
				if (grunt.option('color') === false) {
					child.on('data', function (data) {
						output.write(chalk.stripColor(data));
					});
				} else {
					child.pipe(output);
				}
			};

			grunt.verbose.writeln('Command:', chalk.yellow(cmd));

			if (options.stdout || grunt.option('verbose')) {
				captureOutput(cp.stdout, process.stdout);
			}

			if (options.stderr || grunt.option('verbose')) {
				captureOutput(cp.stderr, process.stderr);
			}

			if (options.stdin) {
				process.stdin.resume();
				process.stdin.setEncoding('utf8');
				if (typeof process.stdin.setRawMode === 'function') {
					process.stdin.setRawMode(true);
				}
				process.stdin.pipe(cp.stdin);
			}
		}

		function _execute(){
			var arg = shellStacks.shift();
			if(arg){
				excute.apply(undefined, arg);
			}else{
				doneFn();
			}
		}
	}

};
