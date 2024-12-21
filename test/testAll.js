"use strict";
/* eslint-disable prefer-template, no-implicit-globals */

const XU = require("@sembiance/xu"),
	path = require("path"),
	assert = require("assert"),
	childProcess = require("child_process");

function run(command, args, options, cb)
{
	options ||= {};
	
	if(!options.silent)
		console.log("RUNNING%s: %s %s", (options.cwd ? " (cwd: " + options.cwd + ")": ""), command, args.join(" "));
	options.maxBuffer ||= (1024*1024)*20;	// 20MB Buffer
	if(!options.hasOwnProperty("redirect-stderr"))
		options["redirect-stderr"] = true;
	
	let p;
	if(cb)	// eslint-disable-line unicorn/prefer-ternary
		p = childProcess.execFile(command, args, options, handler);
	else
		p = childProcess.execFile(command, args, handler);

	if(options.liveOutput)
	{
		p.stdout.pipe(process.stdout);
		p.stderr.pipe(process.stderr);
	}

	function handler(err, stdout, stderr)
	{
		if(options["ignore-errors"])
			err = null;
		if(options["ignore-stderr"])
			stderr = null;

		if(stderr)
		{
			stderr = stderr.replace(/Xlib: +extension "RANDR" missing on display "[^:]*:[^"]+".\n?/, "");
			stderr = stderr.trim();
			if(!stderr.length)
				stderr = null;
		}

		if(options["redirect-stderr"] && (err || stderr))
		{
			if(err)
			{
				stdout = err + stdout;
				err = undefined;
			}

			if(stderr)
			{
				stdout = stderr + stdout;
				stderr = undefined;
			}
		}

		if(options.verbose)
			console.log("%s %s\n%s %s", command, args.join(" "), stdout || "", stderr || "");

		if(cb)
		{
			if(options["redirect-stderr"])
				setImmediate(() => cb(err || stderr, stdout));
			else
				setImmediate(() => cb(err || stderr, stdout, stderr));
		}
		else
		{
			options(err || stderr, stdout, stderr);
		}
	}
}

const validResults = ["abcdefgh", "abcde", "abc", "abc", "abc", "ab", "a", "abc", "abcd", "abc", "abcde", "ab['c','d']e['f','g']done", "abcde", "abcd"];
["test-parallel-noerrarg.js", "test-error-capture.js", "test-error-parallel.js", "test-error-two.js", "test-error.js", "test-exit.js", "test-fallthrough.js",
	"test-finish.js", "test-finish2.js", "test-called-twice.js", "test-dup-fun-names.js", "test.js", "test-jump.js", "test-jump2.js"].serialForEach((testName, subcb, i) =>
{
	run("node", [path.join(__dirname, testName)], {silent : true, "ignore-errors" : true, "redirect-stderr" : true}, (err, data) =>
	{
		assert.strictEqual(data.strip("\n "), validResults[i], testName);
		subcb();
	});
}, () => process.exit(0) );

