import * as api from '$lib/directus.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const tags = await api.getTags();
	if (!tags) {
		throw new Error('Failed to fetch site tags');
	}
	return {
		tags
	};
};
