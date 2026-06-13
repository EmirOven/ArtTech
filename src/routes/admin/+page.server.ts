import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async () => {
	const { data: itemData, error: itemError } = await supabase.from('item').select();

	if (itemError) {
		console.error('Error loading items:', itemError.message);
		return { success: false };
	}

	const { data: tagData, error: tagError } = await supabase.from('tag').select();

	if (tagError) {
		console.error('Error loading tags:', tagError.message);
		return { success: false };
	}

	const { data: tagNameData, error: tagNameError } = await supabase.from('tag_item').select();

	if (tagNameError) {
		console.error('Error loading tagNames:', tagNameError.message);
		return { success: false };
	}

	return {
		success: true,
		items: itemData ?? [],
		tags: tagData ?? [],
		tagNames: tagNameData ?? []
	};
};

export const actions = {
	create_item: async ({ request }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const description = String(formData.get('desc') ?? '').trim();
		const link = String(formData.get('link') ?? '').trim();
		const image = formData.get('img');
		const tags = formData.getAll('tags').map(String);

		if (!name || !description || !link || !(image instanceof File) || image.size === 0) {
			return fail(400, { missing: true });
		}

		const extension = image.name.split('.').pop();
		const imagePath = `${crypto.randomUUID()}${extension ? '.' + extension : ''}`;

		const { error: uploadError } = await supabase.storage
			.from('item_images')
			.upload(imagePath, image, {
				upsert: false,
				contentType: image.type
			});

		if (uploadError) {
			console.error('Error uploading item image:', uploadError.message);
			return fail(500, { uploadError: true });
		}

		const { data: itemData, error: insertError } = await supabase
			.from('item')
			.insert({
				name,
				description,
				img: imagePath,
				link
			})
			.select();

		if (insertError) {
			console.error('Error inserting item:', insertError.message);
			return fail(500, { insertError: true });
		}

		const { error: tagError } = await supabase.from('tag_item').insert(
			tags.map((tag) => {
				return { item_id: itemData[0].id, tag_name: tag };
			})
		);

		if (tagError) {
			console.error('Error inserting item:', tagError.message);
			return fail(500, { tagError: true });
		}

		return { success: true };
	},

	create_tag: async ({ request }) => {
		const formData = await request.formData();
		const tag = String(formData.get('name') ?? '').trim();

		const { error: insertError } = await supabase.from('tag').insert({
			name: tag
		});

		if (insertError) {
			console.error('Error inserting tag:', insertError.message);
			return fail(500, { insertError: true });
		}

		if (!tag) {
			return fail(400, { missing: true });
		}
		return { success: true };
	},

	remove_item: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id') ?? '');
		const accessToken = String(formData.get('access_token') ?? '');
		const refreshToken = String(formData.get('refresh_token') ?? '');

		if (!Number.isInteger(id) || id <= 0) {
			return fail(400, { invalidId: true });
		}

		if (!accessToken || !refreshToken) {
			return fail(401, { unauthorized: true });
		}

		const { error: sessionError } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});

		if (sessionError) {
			console.error('Error setting Supabase session:', sessionError.message);
			return fail(401, { unauthorized: true });
		}

		const { data: item, error: selectError } = await supabase
			.from('item')
			.select('img')
			.eq('id', id)
			.single();

		if (selectError) {
			console.error('Error finding item:', selectError.message);
			return fail(404, { notFound: true });
		}

		const { error: tagDeleteError } = await supabase.from('tag_item').delete().eq('item_id', id);

		if (tagDeleteError) {
			console.error('Error deleting item tags:', tagDeleteError.message);
			return fail(500, { tagDeleteError: true });
		}

		const { data: deletedItems, error: deleteError } = await supabase
			.from('item')
			.delete()
			.eq('id', id)
			.select('id');

		if (deleteError) {
			console.error('Error deleting item:', deleteError.message);
			return fail(500, { deleteError: true });
		}

		if (deletedItems.length !== 1) {
			console.error('Item delete did not return a deleted row:', deletedItems);
			return fail(404, { notFound: true });
		}

		if (item.img) {
			const { error: imageDeleteError } = await supabase.storage
				.from('item_images')
				.remove([item.img]);

			if (imageDeleteError) {
				console.error('Error deleting item image:', imageDeleteError.message);
			}
		}

		return { success: true };
	},

	remove_tag: async ({ request }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const accessToken = String(formData.get('access_token') ?? '');
		const refreshToken = String(formData.get('refresh_token') ?? '');

		if (!name) {
			return fail(400, { missing: true });
		}

		if (!accessToken || !refreshToken) {
			return fail(401, { unauthorized: true });
		}

		const { error: sessionError } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});

		if (sessionError) {
			console.error('Error setting Supabase session:', sessionError.message);
			return fail(401, { unauthorized: true });
		}

		const { error: tagItemDeleteError } = await supabase
			.from('tag_item')
			.delete()
			.eq('tag_name', name);

		if (tagItemDeleteError) {
			console.error('Error deleting tag items:', tagItemDeleteError.message);
			return fail(500, { tagItemDeleteError: true });
		}

		const { data: deletedTags, error: deleteError } = await supabase
			.from('tag')
			.delete()
			.eq('name', name)
			.select('name');

		if (deleteError) {
			console.error('Error deleting tag:', deleteError.message);
			return fail(500, { deleteError: true });
		}

		if (deletedTags.length !== 1) {
			console.error('Tag delete did not return a deleted row:', deletedTags);
			return fail(404, { notFound: true });
		}

		return { success: true };
	}
} satisfies Actions;
