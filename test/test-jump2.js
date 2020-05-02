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
		this.jump(-2);
	},
	function step4()
	{
		console.log("SHOULD NOT SEE1");
		this();
	},
	function step5()
	{
		console.log("SHOULD NOT SEE2");
		this();
	},
	function step6()
	{
		console.log("c");
		this();
	},
	function step7()
	{
		return "d";
	},
	function finish(err, c)
	{
		console.log(c);
		process.exit(0);
	}
);
