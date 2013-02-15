"use strict";

var tiptoe = require("./index");

tiptoe(
	function step1()
	{
		console.log("a");
	},
	function step2()
	{
		console.log("SHOULD NOT SEE1");
	},
	function step3()
	{
		console.log("SHOULD NOT SEE2");
	},
	function finish(err)
	{
		console.log("SHOULD NOT SEE3");
		process.exit(0);
	}
);