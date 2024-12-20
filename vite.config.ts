import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: { exclude: ["fsevents"] },

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
