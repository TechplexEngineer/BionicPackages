import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: {
		exclude: [
			"fsevents",
			"@node-rs/argon2",
			"@node-rs/bcrypt",
			"@node-rs/argon2-wasm32-wasi"
		]
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
