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

		["b", "c", "d"].forEach(letter => this.parallel()(letter==="c" ? "b" : null, letter));
	},
	function step3()
	{
		console.log("SHOULD NOT SEE");
	},
	function finish(err)
	{
		if(err)
		{
			console.log(err);
			console.log("c");
			process.exit(1);
		}

		console.log("SHOULD NOT SEE");
		process.exit(0);
	}
);
