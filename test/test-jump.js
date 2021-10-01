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
			this.jump(3);
		}, 1000);
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
		console.log("d");
		this.jump(1);
	},
	function step7()
	{
		return "e";
	},
	function finish(err, c)
	{
		console.log(c);
		process.exit(0);
	}
);
