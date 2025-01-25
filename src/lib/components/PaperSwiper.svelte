<script lang="ts">
	import { onMount } from 'svelte';
	import PaperCard from './PaperCard.svelte';
	import { fetchPapers } from '$lib/utils/fetchPapers';
    import { register } from 'swiper/element/bundle';
    import Actions from './Actions.svelte';

	register();

	export let query: string;

	let papers: Array<{ title: string; authors: string; year: string; tldr?: string, pdfUrl: string }> = [];
	let offset = 0;
	const limit = 3;
	let isLoading = false;
	let errorMessage = '';

	// Fetch papers dynamically
	async function loadPapers() {
		try {
			isLoading = true;
			const newPapers = await fetchPapers(query, offset, limit);
			papers = [...papers, ...newPapers];
		} catch (error) {
			errorMessage = 'Failed to fetch papers. Please try again.';
			console.error(error);
		} finally {
			isLoading = false;
		}
	}

	// Load initial papers
	onMount(() => {
		loadPapers();
	});

	function onSlideChange(event: CustomEvent) {
		const activeIndex = event.detail[0].activeIndex;
		if (activeIndex >= papers.length - 2 && !isLoading) {
			offset += limit;
			loadPapers();
		}
	}
    function handleAction(action: string) {
		console.log(`Action performed: ${action}`);
	}
</script>

<swiper-container
	space-between={10}
	direction={'vertical'}
	slides-per-view={'auto'}
	mousewheel={true}
	on:swiperslidechange={onSlideChange}
	class="h-full max-w-xl mx-auto rounded-lg shadow-lg mt-2"
>
	{#if papers.length > 0}
		{#each papers as paper (paper.title)}
			<swiper-slide style="height: 95%;" class="rounded-lg">
				<PaperCard
					title={paper.title}
					authors={paper.authors}
					year={paper.year}
					tldr={paper.tldr}
                    pdfUrl={paper.pdfUrl}
				/>
                <Actions onAction={(action) => {
                    if (action === 'view') {
                        // Open paper in new tab    
                        window.open(paper.pdfUrl, '_blank');
                    } else if (action === 'share') {
                        // share teh link to bsky
                        window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(paper.pdfUrl)}`, '_blank');
                    } else if (action === 'settings') {
                        console.log('Opened settings for paper:', paper.title);
                    }
                }} />
			</swiper-slide>
		{/each}
	{:else if errorMessage}
		<swiper-slide class="flex justify-center items-center text-red-500 text-lg font-semibold">
			{errorMessage}
		</swiper-slide>
	{:else}
		<swiper-slide class="flex justify-center items-center text-gray-400 text-lg font-semibold">
			Loading papers...
		</swiper-slide>
	{/if}
</swiper-container>
