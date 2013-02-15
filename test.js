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

		this(null, "b");
	},
	function step3(b)
	{
		console.log(b);

		["c", "e", "f"].forEach(function(letter)
		{
			if(letter==="e")
				this.parallel()(null, letter);
			else
				this.parallel()(null, letter, String.fromCharCode(letter.charCodeAt(0)+1));
		}.bind(this));
	},
	function step4(cd, e, fg)
	{
		console.log(cd);
		console.log(e);
		console.log(fg);

		this();
	},
	function finish(err)
	{
		if(err)
		{
			console.error(err);
			process.exit(1);
		}

		console.log("done");
		process.exit(0);
	}
);