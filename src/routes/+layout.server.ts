import * as api from '$lib/directus.server.svelte';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const tagList = await api.getTags();
	if (!tagList) {
		throw new Error('Failed to fetch site tags');
	}
	return {
		tags: tagList.allTagData
	};
};
