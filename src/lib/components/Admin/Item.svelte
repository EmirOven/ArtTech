<script lang="ts">
	import { enhance } from '$app/forms';
	import { env } from '$env/dynamic/public';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		id: number;
		name: string;
		description: string | null;
		img: string | null;
		link: string | null;
		tags: Array<string>;
	}

	let props: Props = $props();
	let IMG_URL: string | null = $state<string>('');

	$effect(() => {
		IMG_URL = env.PUBLIC_SUPABASE_URL + '/storage/v1/object/public/item_images/' + props.img;
	});
</script>

<div class="item_container">
	{#if props.img != null}
		<img src={IMG_URL} alt="item_image" class="item_img" />
	{/if}
	<h1 class="name">{props.name}</h1>
	<p class="description">{props.description}</p>
	<div class="tags">
		{#each props.tags as tag}
			<div class="tag_container">
				<p>{tag}</p>
			</div>
		{/each}
	</div>
	<form
		action="?/remove_item"
		method="POST"
		class="delete_form"
		use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					alert(m.item_delete_success());
				}
			};
		}}
		enctype="multipart/form-data"
	>
		<button class="error" name="id" value={props.id}>{m.delete()}</button>
	</form>
	<button>{m.edit()}</button>
</div>

<style lang="scss">
	.tag_container {
		background: #9191a5;
		width: fit-content;
		height: fit-content;
		padding: 0.25rem 1rem;
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
	.item_container {
		background: #b1b1c5;
		width: 100%;
		padding: 2rem;
		border-radius: 1.5rem;
		display: grid;
		grid-template-columns: 8rem 1fr;
		grid-template-rows: auto;
		gap: 1rem 2rem;

		* {
			word-break: break-all;
		}
	}

	.delete_form {
		button {
			width: 100%;
		}
	}

	.tags {
		display: flex;
		grid-row: 3 / span 2;
		grid-column: 2;
	}

	.item_img {
		border-radius: 0.75rem;
		grid-row: 1 / span 2;
	}

	.name {
		height: fit-content;
	}

	.description {
		text-wrap: 1;
	}
</style>
