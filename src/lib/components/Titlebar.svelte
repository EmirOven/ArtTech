<script lang="ts">
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';
	import { supabase } from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import type { User } from '@supabase/supabase-js';
	import { goto, onNavigate } from '$app/navigation';

	const currentLocale = getLocale();

	const updateLocale: (e: Event) => void = (e) => {
		const target = e.target as HTMLSelectElement;

		setLocale(target.value as 'en' | 'tr');
	};

	let userData = $state<User | null>(null);

	onNavigate(async () => {
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();

		console.log(error);

		userData = user;
	});

	onMount(async () => {
		const {
			data: { user },
			error
		} = await supabase.auth.getUser();

		console.log(error);

		userData = user;
	});

	const logout: () => void = async () => {
		const { error: signoutError } = await supabase.auth.signOut();

		console.log(signoutError);

		const {
			data: { user },
			error
		} = await supabase.auth.getUser();

		console.log(error);

		userData = user;
		goto('/');
	};

	$inspect(userData);
</script>

<div class="container">
	<div class="left">
		<a class="icon" href="/">
			<img src="/arttech.svg" alt="Logo" class="icon" />
		</a>

		<select name="lang" id="lang" onchange={updateLocale} value={currentLocale}>
			{#each locales as locale}
				<option value={locale}>{m.this_lang({}, { locale })}</option>
			{/each}
		</select>
	</div>
	<div class="options">
		{#key userData}
			{#if userData == null}
				<button onclick={() => goto('/login')}>{m.login()}</button>
			{:else}
				<button onclick={logout} class="logout-button error">
					<span class="material-symbols-outlined">logout</span>
				</button>
			{/if}
		{/key}
	</div>
</div>

<style lang="scss">
	.container {
		background-color: #b1b1c5;
		border-radius: 1.5rem;
		box-shadow: 0 0 3rem rgba(0, 0, 0, 0.5);
		width: 80%;
		height: 6rem;
		margin-top: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 2rem;
		@media screen and (max-width: 900px) {
			width: 100%;
			height: 6rem;
			border-radius: 0;
			margin-top: 0;
		}

		.left {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 1rem;
		}
	}

	.logout-button {
		height: 3rem;
		width: 3rem;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon {
		width: 4rem;
		height: 4rem;
	}
</style>
