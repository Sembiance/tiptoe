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
		throw "d";	// eslint-disable-line no-throw-literal
	},
	function step5()
	{
		console.log("SHOULD NOT SEE1");
	},
	function finish(err)
	{
		if(err)
		{
			console.log(err);
			console.log("e: should only see once");
			setTimeout(() => process.exit(1), 1000);
			return;
		}

		console.log("SHOULD NOT SEE2");
		process.exit(0);
	}
);
