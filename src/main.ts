import {demoAsyncMonitor} from './demo-async-monitor';

document.addEventListener('DOMContentLoaded', () => {
	const appDiv = document.getElementById('app');
	if (appDiv) appDiv.innerHTML = '<h1>Hello, TypeScript Web App!</h1>';
});

demoAsyncMonitor();
