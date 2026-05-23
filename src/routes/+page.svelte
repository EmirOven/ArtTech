<script lang="ts">
	import Titlebar from '$lib/components/Titlebar.svelte';
	import ImageSlider from '$lib/components/ImageSlider.svelte';
</script>

<div class="container">
	<ImageSlider />
</div>

<style lang="scss">
	.container {
		width: 100%;
		max-height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;

		@media only screen and (max-width: 800px) {
			width: 100%;
		}
	}
</style>
