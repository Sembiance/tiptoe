"use strict";

var tiptoe = require("./index");

function test(cb)
{
	tiptoe(
		function step1()
		{
			console.log("a");
			this();
		},
		function step2()
		{
			console.log("b");
			return cb(undefined, "z"), undefined;
			console.log("SHOULD NOT SEE1");
		},
		function step3(err)
		{
			console.log("SHOULD NOT SEE2");
			cb(err, "SHOULD NOT SEE3");
		}
	);
}

test((err, msg) => { console.log(msg); return "SHOULD NOT SEE4"; });
