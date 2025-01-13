import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		basicSsl({
			/** name of certification */
			name: 'Mike Run'
			// /** custom trust domains */
			// domains: ['*.custom.com'],
			// /** custom certification directory */
			// certDir: '/Users/.../.devServer/cert'
		})
	]
});
