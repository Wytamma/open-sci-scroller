<script lang="ts">
	import { onMount } from 'svelte';
	import PaperCard from './PaperCard.svelte';
	import { fetchPapers } from '$lib/utils/fetchPapers';
	import { register } from 'swiper/element/bundle';
	import Actions from './Actions.svelte';

	register();

	export let query: string;

	// State variables
	let papers: Array<{ title: string; authors: string; year: string; tldr?: string; pdfUrl: string }> = [];
	let offset = 0;
	const limit = 3;
	let isLoading = false;
	let errorMessage = '';

	// Fetch papers dynamically
	async function loadPapers() {
		try {
			isLoading = true;

			// Fetch new papers
			const newPapers = await fetchPapers(query, offset, limit);

			// Append the new papers
			papers = [...papers, ...newPapers];

			// Update Swiper virtual slides
			const swiper = document.querySelector('swiper-container').swiper;
			swiper.virtual.slides = papers.map(
				(paper) => `
	
							${PaperCard({
								title: paper.title,
								authors: paper.authors,
								year: paper.year,
								tldr: paper.tldr,
								pdfUrl: paper.pdfUrl,
							})}
							${Actions({
								onAction: (action) => handleAction(action, paper),
							})}
					
					
				`
			);
			swiper.virtual.update();
		} catch (error) {
			errorMessage = 'Failed to fetch papers. Please try again.';
			console.error(error);
		} finally {
			isLoading = false;
		}
	}

	// Handle slide change event
	function onSlideChange(event: CustomEvent) {
		const activeIndex = event.detail[0].activeIndex;

		// Trigger new fetch when near the end
		if (activeIndex >= papers.length - 2 && !isLoading) {
			offset += limit;
			loadPapers();
		}
	}

	// Handle actions (e.g., View, Share, Settings)
	function handleAction(action: string, paper: { title: string; pdfUrl: string }) {
		if (action === 'view') {
			// Open paper in new tab
			window.open(paper.pdfUrl, '_blank');
		} else if (action === 'share') {
			// Share the link to BlueSky
			window.open(
				`https://bsky.app/intent/compose?text=${encodeURIComponent(paper.pdfUrl)}`,
				'_blank'
			);
		} else if (action === 'settings') {
			console.log('Opened settings for paper:', paper.title);
		}
	}

	// Load initial papers on mount
	onMount(() => {
		loadPapers();
	});
</script>

<!-- Swiper Container -->
<swiper-container
	direction="vertical"
	mousewheel
	virtual="true"
	on:swiperslidechange={onSlideChange}
	class="h-full max-w-xl mx-auto shadow-lg"
>
	{#if errorMessage}
		<swiper-slide class="flex justify-center items-center text-red-500 text-lg font-semibold">
			{errorMessage}
		</swiper-slide>
	{:else if isLoading && papers.length === 0}
		<swiper-slide class="flex justify-center items-center text-gray-400 text-lg font-semibold">
			Loading papers...
		</swiper-slide>
	{/if}
</swiper-container>
