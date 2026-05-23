import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const actions = {
	login: async ({ request }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '');
		const password = String(formData.get('password') ?? '');

		const { data, error: authError } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (authError) {
			console.error('Error inserting tag:', authError.message);
			return fail(500, { authError: true });
		}

		console.log(data);

		redirect(303, '/admin');

		return { success: true };
	}
} satisfies Actions;
