import {default as nodeBrowserConfig} from "/mnt/compendium/DevLab/common/eslint/node-browser.eslint.config.js";

nodeBrowserConfig.push({
	ignores :
	[
		"sandbox/"
	]
});

export default nodeBrowserConfig;	// eslint-disable-line unicorn/prefer-export-from
