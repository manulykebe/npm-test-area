import { WatchFunction, Group, sleep } from "async-monitor.js";

// const { Element, Group, sleep, version } = require('async-monitor.js');

const serialWatches = new Group();

const function_to_watch1 = () => sleep(1, /*fail:*/ false);
const function_to_watch2 = () => sleep(2, /*fail:*/ true);
const function_to_watch3 = () => sleep(3, /*fail:*/ false);

serialWatches.addWatch({
	parent: undefined,
	child: "a",
	f: function_to_watch1,
	onCompleteCallback: function () {
		console.log("++++onCompleteCallback() after step 1");
	},

	_startTime: 0,
	_stopTime: 0,
	_duration: 0,
	sequence: undefined,
	onStartCallback: undefined,
	onRejectCallback: undefined,
});

serialWatches.addWatch({
	parent: "a",
	child: "b",
	f: function_to_watch2,
	onCompleteCallback: function () {
		console.log("++++onCompleteCallback() after step 2");
	},

	_startTime: 0,
	_stopTime: 0,
	_duration: 0,
	sequence: undefined,
	onStartCallback: undefined,
	onRejectCallback: undefined,
});

serialWatches.addWatch({
	parent: "b",
	child: undefined,
	f: function_to_watch3,
	onCompleteCallback: function () {
		console.log("++++onCompleteCallback() after step 3");
	},

	_startTime: 0,
	_stopTime: 0,
	_duration: 0,
	sequence: undefined,
	onStartCallback: undefined,
	onRejectCallback: undefined,
});

function demo_serial_execution() {
	console.clear();
	console.log("serial execution:");
	console.log(`---> function_to_watch1: ${function_to_watch1.toString()}`);
	console.log("   |");
	console.log(`   ---> function_to_watch2: ${function_to_watch2.toString()}`);
	console.log("      |");
	console.log(
		`      ---> function_to_watch3: ${function_to_watch3.toString()}`
	);

	serialWatches.reset();
	serialWatches.WatchAll(
		() => {
			console.table(
				serialWatches._functions.map((el: WatchFunction, i: number) => {
					return {
						index: i,
						start: el._startTime - (el.group?._startTime || 0),
						duration: el._duration,
						f: el.f.toString(),
					};
				})
			);
		}
		// () => {}
	);
}
demo_serial_execution();
