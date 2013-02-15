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

		this.capture();
		this("b");
	},
	function step3(err)
	{
		console.log(err);
		this(null, "c");
	},
	function step4(c)
	{
		console.log(c);
		throw "d";
	},
	function step5()
	{
		console.log("SHOULD NOT SEE1");
	},
	function finish(err)
	{
		if(err)
		{
			console.error(err);
			console.log("e");
			process.exit(1);
		}

		console.log("SHOULD NOT SEE2");
		process.exit(0);
	}
);