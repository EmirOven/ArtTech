<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Item from '$lib/components/Admin/Item.svelte';
	import InsertItemModal from '$lib/components/Admin/InsertItemModal.svelte';
	import InsertTagModal from '$lib/components/Admin/InsertTagModal.svelte';
	import Tag from '$lib/components/Admin/Tag.svelte';

	let { data } = $props();
	let showInsertItemModal = $state(false);
	let showInsertTagModal = $state(false);

	$effect(() => {
		console.log(data);
	});
</script>

<div class="container">
	{#if data.success == true}
		<h1>{m.available_items()}</h1>
		{#if data.items?.length == 0}
			{m.no_items_admin()}
		{:else}
			{#each data.items as item}
				<Item
					id={item.id}
					description={item.description}
					img={item.img}
					link={item.link}
					name={item.name}
					tags={data.tagNames != undefined
						? (data.tagNames
								.map((value) => {
									if (value.item_id == item.id) {
										return value.tag_name;
									}
								}) as string[])
						: []}
				/>
			{/each}
		{/if}
		<button class="add_item" onclick={() => (showInsertItemModal = true)}>
			{m.new()}
		</button>

		<h1>{m.available_tags()}</h1>
		{#if data.tags?.length == 0}
			{m.no_tags_admin()}
		{:else}
			{#each data.tags as tag}
				<Tag name={tag.name} />{/each}
		{/if}
		<button class="add_item" onclick={() => (showInsertTagModal = true)}>
			{m.new()}
		</button>
	{/if}
</div>

{#if showInsertItemModal}
	<InsertItemModal
		onClose={() => (showInsertItemModal = false)}
		tags={data.tags != undefined ? data.tags.map((value) => value.name) : []}
	/>
{/if}

{#if showInsertTagModal}
	<InsertTagModal onClose={() => (showInsertTagModal = false)} />
{/if}

<style lang="scss">
	.container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 1rem;
	}
</style>
