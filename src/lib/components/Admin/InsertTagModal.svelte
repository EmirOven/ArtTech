<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		onClose: () => void;
	}

	let { onClose }: Props = $props();

	let tagName = $state<string>('');
</script>

<div class="item_modal_underlay">
	<form
		class="item_modal"
		method="POST"
		action="?/create_tag"
		enctype="multipart/form-data"
		use:enhance={() => {
			return async ({ result, update }) => {
				await update();

				if (result.type === 'success') {
					alert(m.tag_create_success());

					onClose();
				}
			};
		}}
	>
		<button class="exit_button inverse" type="button" aria-label="Close modal" onclick={onClose}>
			<span class="material-symbols-outlined">close</span>
		</button>
		<h1>{m.new_tag()}</h1>
		<div class="input_cluster">
			<label for="name">{m.name()}:</label>
			<input type="text" name="name" id="name" bind:value={tagName} />
		</div>
		<button type="submit">{m.create()}</button>
	</form>
</div>

<style lang="scss">
	.item_modal_underlay {
		position: fixed;
		inset: 0;
		z-index: 10;
		background-color: rgba(0, 0, 0, 0.25);
		backdrop-filter: opacity(50%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.item_modal {
		position: relative;
		background-color: #b1b1c5;
		border-radius: 1.5rem;
		box-shadow: 0 0 3rem rgba(0, 0, 0, 0.5);
		width: 30rem;
		height: fit-content;
		display: flex;
		flex-direction: column;
		align-items: start;
		padding: 1.5rem 2rem;
		gap: 1rem;
	}

	.exit_button {
		position: absolute;
		padding: 0.1rem;
		top: 0.75rem;
		right: 0.75rem;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 100%;
		line-height: 1;
	}

	.input_cluster {
		display: flex;
		flex-direction: column;
	}
</style>
