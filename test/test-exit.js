"use strict";

const tiptoe = require("./index");

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
		this.exit();
	},
	function step4()
	{
		console.log("SHOULD NOT SEE1");
	},
	function finish(err)
	{
		console.log("SHOULD NOT SEE2");
		process.exit(0);
	}
);
