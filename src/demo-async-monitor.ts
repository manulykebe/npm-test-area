import * as monitor from 'async-monitor.js';

export function demoAsyncMonitor() {
	const watchGroup = new monitor.Group();
	watchGroup.addWatch(() => monitor.sleep(undefined, false));
	watchGroup.addWatch(() => monitor.sleep(undefined, false));
	watchGroup.addWatch(() => monitor.sleep(undefined, false));
	console.log(watchGroup.loggerTree);
	watchGroup.watchAll();
}
