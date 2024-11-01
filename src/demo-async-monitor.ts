import {Logger, Group, sleep} from 'async-monitor.js';

export function demoAsyncMonitor() {
	const watchGroup = new Group();
	watchGroup.addWatch(() => sleep(5, false));
	watchGroup.addWatch(() => sleep(undefined, false));
	watchGroup.addWatch(() => sleep(undefined, false));
	watchGroup.watchAll().then(() => {
		watchGroup.logger.log('watchGroup done');
	});

	const watchGroup2 = new Group();
	watchGroup2.addWatch(() => sleep(5, false));
	watchGroup2.addWatch(() => sleep(undefined, false));
	watchGroup2.addWatch(() => sleep(undefined, false));
	watchGroup2.watchAll().then(() => {
		watchGroup2.logger.log('watchGroup2 done');
	});
}
