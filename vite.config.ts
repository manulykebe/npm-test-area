import {defineConfig} from 'vite';

export default defineConfig({
	root: './',
	base: '/npm-test-area/',
	publicDir: 'public',
	build: {
		outDir: 'docs',
	},
});
