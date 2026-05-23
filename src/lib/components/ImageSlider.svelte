<script lang="ts">
	import { register } from 'swiper/element';
	import type { SwiperContainer } from 'swiper/element';

	register();

	let swiperEl: SwiperContainer;

	function slideNext() {
		swiperEl?.swiper.slideNext();
	}

	function slidePrev() {
		swiperEl?.swiper.slidePrev();
	}
</script>

<main class="container">
	<swiper-container bind:this={swiperEl} slides-per-view="1" mousewheel-force-to-axis="true">
		<swiper-slide>1</swiper-slide>
		<swiper-slide>2</swiper-slide>
		<swiper-slide>3 </swiper-slide>
	</swiper-container>

	<div class="controls">
		<button class="material-symbols-outlined" id="prev" onclick={slidePrev}>chevron_left</button>
		<button class="material-symbols-outlined" id="next" onclick={slideNext}>chevron_right</button>
	</div>
</main>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.controls {
		background-color: #9191a5;
		display: flex;
		align-items: center;
		gap: 1px;
		border-radius: 999rem;
		overflow: hidden;
	}

	button {
		background-color: #b1b1c5;
		padding: 0.25rem 0.5rem;
		cursor: pointer;

		&:active {
			background-color: #9191a5;
		}
	}

	swiper-container {
		width: 800px;
		height: 600px;
		background-color: #b1b1c5;
		border-radius: 1.5rem;
		box-shadow: 0 0 3rem rgba(0, 0, 0, 0.5);

		@media only screen and (max-width: 100px) {
			width: 100%;
		}
	}
</style>
