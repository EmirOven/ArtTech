<script lang="ts">
	import './layout.css';
	import './layout.scss';
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import favicon from '$lib/assets/arttech.svg';

	import Titlebar from '$lib/components/Titlebar.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="layout">
	<Titlebar />
	<div class="content">{@render children()}</div>
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>

<style lang="scss">
	.material-symbols-outlined {
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}

	.layout {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		gap: 2rem;
	}

	.content {
		width: 80%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		@media only screen and (max-width: 800px) {
			width: 100%;
		}
	}
</style>
