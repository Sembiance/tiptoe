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
		this(null, "SHOULD NOT SEE1");
		this(null, "SHOULD NOT SEE2");
		this(null, "SHOULD NOT SEE3");
		this(null, "SHOULD NOT SEE4");
		this(null, "SHOULD NOT SEE5");
	},
	function step3(b)
	{
		console.log(b);

		this(undefined, "c");
		this(null, "SHOULD NOT SEE6");
	},
	function finish(err, c)
	{
		console.log(c);
		process.exit(0);
	}
);
