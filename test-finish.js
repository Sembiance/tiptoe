"use strict";

var tiptoe = require("./index");

tiptoe(
	function step1()
	{
		return "a";
	},
	function step2(a)
	{
		console.log(a);

		this(null, "b");
	},
	function step3(b)
	{
		console.log(b);
		this.finish(null, "c");
	},
	function step4()
	{
		console.log("SHOULD NOT SEE1");
	},
	function finish(err, c)
	{
		console.log(c);
		process.exit(0);
	}
);