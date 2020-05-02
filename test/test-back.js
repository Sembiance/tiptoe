"use strict";

const tiptoe = require("./index");
const RETRY_COUNT=2;

tiptoe(
	function step1()
	{
		this.parallel()(undefined, RETRY_COUNT);
		this.parallel()(undefined, "a");
	},
	function step2(triesCounter, a)
	{
		if(a)
			console.log(a);

		console.log("b %d of %d", triesCounter, RETRY_COUNT);
		this.capture();
		this(triesCounter ? triesCounter : undefined);
	},
	function step3(triesCounter)
	{
		if(triesCounter)
			return this.back(undefined, triesCounter-1);

		this(null, "c");
	},
	function finish(err, c)
	{
		if(err)
		{
			console.log("SHOULD NOT SEE2");
			process.exit(1);
		}

		console.log(c);
		process.exit(0);
	}
);
