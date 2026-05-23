<script lang="ts">
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import { supabase } from '$lib/supabaseClient';

	const login: () => void = async () => {
		const { data, error: authError } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (authError) {
			console.error('Error inserting tag:', authError.message);

      
		}

		console.log(data);
		goto('/admin');
	};

	let email = $state<string>('');
	let password = $state<string>('');
</script>

<div class="login-container">
	<form class="form">
		<div class="cluster">
			<label for="email">{m.email()}:</label>
			<input type="text" name="email" id="email" bind:value={email} />
		</div>
		<div class="cluster">
			<label for="email">{m.password()}:</label>
			<input type="password" name="password" id="password" bind:value={password} />
		</div>
		<button type="submit" onclick={login}>{m.login_action()}</button>
	</form>
</div>

<style lang="scss">
	.login-container {
		width: 30rem;
		height: fit-content;
		background-color: #b1b1c5;
		border-radius: 1.5rem;
		box-shadow: 0 0 3rem rgba(0, 0, 0, 0.5);
		flex-direction: column;
		align-items: start;
		padding: 1.5rem 2rem;
	}

	.cluster {
		display: flex;
		flex-direction: column;
	}

	.form {
		height: fit-content;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
