import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabaseAdmin';

export const load: PageServerLoad = async () => {
	const { data: itemData, error: itemError } = await supabaseAdmin.from('item').select();

	if (itemError) {
		console.error('Error loading items:', itemError.message);
		return { success: false };
	}

	const { data: tagData, error: tagError } = await supabaseAdmin.from('tag').select();

	if (tagError) {
		console.error('Error loading tags:', tagError.message);
		return { success: false };
	}

	const { data: tagNameData, error: tagNameError } = await supabaseAdmin.from('tag_item').select();

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

		const { error: uploadError } = await supabaseAdmin.storage
			.from('item_images')
			.upload(imagePath, image, {
				upsert: false,
				contentType: image.type
			});

		if (uploadError) {
			console.error('Error uploading item image:', uploadError.message);
			return fail(500, { uploadError: true });
		}

		const { data: itemData, error: insertError } = await supabaseAdmin
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

		const { error: tagError } = await supabaseAdmin.from('tag_item').insert(
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

		const { error: insertError } = await supabaseAdmin.from('tag').insert({
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

		const { error: deleteError } = await supabaseAdmin.from('item').delete().eq('id', id);

		if (deleteError) {
			console.error('Error inserting tag:', deleteError.message);
			return fail(500, { deleteError: true });
		}

		return { success: true };
	},

	remove_tag: async ({ request }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '');

		const { error: deleteError } = await supabaseAdmin.from('tag').delete().eq('name', name);

		if (deleteError) {
			console.error('Error inserting tag:', deleteError.message);
			return fail(500, { deleteError: true });
		}

		return { success: true };
	}
} satisfies Actions;
