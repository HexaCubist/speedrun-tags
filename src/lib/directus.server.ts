import { createDirectus, authentication, rest, readItems, readSingleton } from '@directus/sdk';
import { env } from '$env/dynamic/private';
import { env as pubEnv } from '$env/dynamic/public';

const client = createDirectus(env.directus_url).with(authentication()).with(rest());
client.setToken(env.directus_token);

export enum Status {
	Draft = 'draft',
	Published = 'published',
	Archived = 'archived'
}

export enum imagePresets {
	thumbnail = 'thumbnail',
	aspect = 'aspect-thumbnail',
	medium = 'medium',
	large = 'large',
	hero = 'hero',
	original = 'original'
}

export interface Image {
	id: string;
	src: Record<imagePresets, string>;
	alt: string;
	width: number;
	height: number;
	focal_point_x: number;
	focal_point_y: number;
}

export interface Location {
	coordinates: number[];
	type: 'Point';
}

export const getTags = async () => {
	const res = (await client.request(
		readItems('NFC_Tags', {
			fields: ['id', 'status', 'sort', 'Name', 'Hint', 'hint_image', 'location']
		})
	)) as {
		id: string;
		status: Status;
		sort: number;
		Name: string;
		Hint: string;
		hint_image: Image;
		location: Location;
	}[];
	return res;
};
