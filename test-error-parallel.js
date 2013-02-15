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

		["b", "c", "d"].forEach(function(letter)
		{
			this.parallel()(letter==="c" ? "b" : null, letter);
		}.bind(this));
	},
	function step3()
	{
		console.log("SHOULD NOT SEE");
	},
	function finish(err)
	{
		if(err)
		{
			console.error(err);
			console.log("c");
			process.exit(1);
		}

		console.log("SHOULD NOT SEE");
		process.exit(0);
	}
);