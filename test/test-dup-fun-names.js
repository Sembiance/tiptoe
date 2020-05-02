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
		this(undefined, "c");
	},
	function step3(c)
	{
		console.log(c);
		return ["d", "e"];
	},
	function step3(de)
	{
		console.log(de[0]);
		console.log(de[1]);
		
		this();
	},
	function finish(err)
	{
		if(err)
		{
			console.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);
