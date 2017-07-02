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
		this(a==="a" ? true : undefined);
	},
	function step3(err)
	{
		if(err)
			return this.back(undefined, "b");

		this(null, "c");
	},
	function step4(c)
	{
		console.log(c);
		this();
	},
	function finish(err)
	{
		if(err)
		{
			console.log("SHOULD NOT SEE2");
			process.exit(1);
		}

		console.log("d");
		process.exit(0);
	}
);