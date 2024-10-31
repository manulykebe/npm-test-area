import * as monitor from 'async-monitor.js';

export function demoAsyncMonitor() {
	const watchGroup = new monitor.Group({repeat: 0});
	watchGroup.addWatch(() => monitor.sleep(undefined, false));
	watchGroup.addWatch(() => monitor.sleep(undefined, false));
	watchGroup.addWatch(() => monitor.sleep(undefined, false));
	watchGroup.addWatch(() => monitor.sleep(undefined, false));
	monitor.logger.log(watchGroup.loggerTree, ['tree', `tree-${watchGroup.id}`]);
	watchGroup.watchAll();
}
