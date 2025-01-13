import { createDirectus, authentication, rest, readItems, readSingleton } from '@directus/sdk';
import { env } from '$env/dynamic/private';
import { env as pubEnv } from '$env/dynamic/public';
import { browser } from '$app/environment';
import { Tag, TagList, type TagData } from './tags.svelte';
import { appState } from './appState.svelte';
import { _ } from '$env/static/private';

const client = createDirectus(env.directus_url).with(authentication()).with(rest());
client.setToken(env.directus_token);

export const getTags = async () => {
	const res = new TagList(
		(
			(await client.request(
				readItems('NFC_Tags', {
					fields: ['id', 'status', 'sort', 'Name', 'Hint', 'hint_image.*', 'location'],
					sort: 'sort',
					filter: {
						status: {
							_eq: 'published'
						}
					}
				})
			)) as TagData[]
		).map((t) => {
			return new Tag(t, appState());
		})
	);
	return res;
};
