import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
const DEV_PORT = parseInt(env.DEV_PORT) || 2121;
const PREVIEW_PORT = parseInt(env.PREVIEW_PORT) || 3000;

// Site URL - ganti sesuai dengan production URL kamu
const SITE_URL = env.SITE_URL || `http://localhost:${DEV_PORT}`;

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	// base: '/your-base-path', // Uncomment jika deploy di subdirectory

	output: 'server',
	adapter: node({
		mode: 'standalone',
	}),

	/* Like Vercel, Netlify,… Mimicking for dev. server */
	// trailingSlash: 'always',

	server: {
		/* Dev. server only - for npm run dev */
		port: DEV_PORT,
	},

	preview: {
		/* Preview server - for npm run preview after build */
		port: PREVIEW_PORT,
	},

	integrations: [
		//
		sitemap(),
		tailwind(),
	],
});
