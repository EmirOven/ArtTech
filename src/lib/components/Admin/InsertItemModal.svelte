<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		onClose: () => void;
		tags: string[];
	}

	type Item = {
		name: string;
		desc: string;
		file: FileList | undefined;
		tags: Array<string>;
		link: string;
	};

	let props: Props = $props();

	let itemData = $state<Item>({
		name: '',
		desc: '',
		file: undefined,
		tags: [],
		link: ''
	});

	let tagsSelection = $state<string[]>([]);
</script>

<div class="item_modal_underlay">
	<form
		class="item_modal"
		method="POST"
		action="?/create_item"
		enctype="multipart/form-data"
		use:enhance={() => {
			return async ({ result, update }) => {
				await update();

				if (result.type === 'success') {
					alert(m.item_create_success());

					props.onClose();
				}
			};
		}}
	>
		<button
			class="exit_button inverse"
			type="button"
			aria-label="Close modal"
			onclick={props.onClose}
		>
			<span class="material-symbols-outlined">close</span>
		</button>
		<h1>{m.new_item()}</h1>
		<div class="input_cluster">
			<label for="name">{m.name()}:</label>
			<input type="text" name="name" id="name" bind:value={itemData.name} />
		</div>
		<div class="input_cluster">
			<label for="desc">{m.desc()}:</label>
			<input type="text" name="desc" id="desc" bind:value={itemData.desc} />
		</div>
		<div class="input_cluster">
			<label for="link">{m.purchase_link()}:</label>
			<input type="text" name="link" id="link" bind:value={itemData.link} />
		</div>
		<div class="input_cluster">
			<label for="img">{m.img()}:</label>
			<input type="file" name="img" id="img" bind:files={itemData.file} />
		</div>
		<div class="tags">
			<p>{m.tags()}:</p>
			<div class="tag-options">
				{#each props.tags as tag}
					<label
						><input
							type="checkbox"
							bind:group={tagsSelection}
							name="tags"
							value={tag}
						/>{tag}</label
					>
				{/each}
			</div>
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

	.tags {
		label {
			display: flex;
			gap: 0.5rem;
			align-items: center;
		}
		.tag-options {
			display: flex;
			gap: 1.25rem;
		}

		display: flex;
		flex-direction: column;
		max-height: 8rem;
		overflow-y: scroll;
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
