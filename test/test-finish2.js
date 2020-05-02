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
		
		setTimeout(() =>
		{
			console.log("c");
			this.finish(null, "d");
		}, 1000);
	},
	function step4()
	{
		console.log("SHOULD NOT SEE1");
	},
	function step5()
	{
		console.log("SHOULD NOT SEE2");
	},
	function finish(err, c)
	{
		console.log(c);
		process.exit(0);
	}
);
