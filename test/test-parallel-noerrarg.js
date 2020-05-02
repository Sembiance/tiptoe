"use strict";

const tiptoe = require("./index");

tiptoe(
	function step1()
	{
		this.parallel(true)("a", "b");
		this.parallel()(undefined, "c", "d");
		this.parallel(true)("e", "f");
	},
	function step2(ab, cd, ef)
	{
		console.log("%s%s%s", ab.join(""), cd.join(""), ef.join(""));

		this.capture();
		this.parallel()("g");
	},
	function step3(g)
	{
		console.log(g);
		this.parallel()(undefined, "h");
	},
	function finish(err, h)
	{
		if(err)
		{
			console.log("SHOULD NOT SEE2");
			process.exit(1);
		}

		console.log(h);
		process.exit(0);
	}
);
