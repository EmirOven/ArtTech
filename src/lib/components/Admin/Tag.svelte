<script lang="ts">
	import { enhance } from '$app/forms';
	import { env } from '$env/dynamic/public';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		name: string;
	}

	let props: Props = $props();
	let IMG_URL: string | null = $state<string>('');
</script>

<div class="item_container">
	<p>{props.name}</p>
	<form
		action="?/remove_tag"
		method="POST"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					alert(m.tag_delete_success());
				}
			};
		}}
		enctype="multipart/form-data"
	>
		<button
			class="delete_button inverse error"
			type="button"
			aria-label="Close modal"
			name="name"
			value={props.name}
		>
			<span class="material-symbols-outlined">close</span>
		</button>
	</form>
</div>

<style lang="scss">
	.item_container {
		background: #b1b1c5;
		width: fit-content;
		padding: 0.25rem 1rem;
		padding-right: 0.25rem;
		border-radius: 1.5rem;
		gap: 0.5rem;
		display: flex;
		justify-content: center;
		align-items: center;

		* {
			word-break: break-all;
		}
	}

	p {
		width: fit-content;
	}

	.delete_button {
		padding: 0.75rem;
		width: 1rem;
		height: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
		line-height: 1;

		.material-symbols-outlined {
			font-size: 1.25rem;
		}
	}
</style>
