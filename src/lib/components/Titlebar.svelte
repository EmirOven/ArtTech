<script lang="ts">
	import { locales, getLocale, setLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages';

	const currentLocale = getLocale();

	const updateLocale: (e: Event) => void = (e) => {
		const target = e.target as HTMLSelectElement;

		setLocale(target.value as 'en' | 'tr');
	};
</script>

<div class="container">
	<div class="left">
		<div class="icon">
			<img src="/arttech.svg" alt="Logo" class="icon" />
		</div>

		<select name="lang" id="lang" onchange={updateLocale} value={currentLocale}>
			{#each locales as locale}
				<option value={locale}>{m.this_lang({}, { locale })}</option>
			{/each}
		</select>
	</div>
	<div class="options"></div>
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

	.icon {
		width: 4rem;
		height: 4rem;
	}
</style>
