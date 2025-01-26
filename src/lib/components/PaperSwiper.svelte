<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import PaperCard from './PaperCard.svelte';
	import { fetchPapers } from '$lib/utils/fetchPapers';
    import { register } from 'swiper/element/bundle';
    import Actions from './Actions.svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { queryStore, addToFavourites, removeFromFavourites } from '$lib/stores/queryStore';

	register();

	export let query: string;
	let favourites: Array<{ id: string; title: string }> = [];

	const unsubscribe = queryStore.subscribe((state) => {
		favourites = state.favourites;
	});
	interface Paper {
		title: string;
		authors: string;
		year: string;
		tldr?: string;
		pdfUrl: string;
		overlay: boolean;
		id: string;
	}
	let papers: Array<Paper> = [];
	let offset = 0;
	const limit = 20;
	let isLoading = false;
	let errorMessage = '';
	let activeIndex = 0;

	const modalStore = getModalStore();
	
	// Fetch papers dynamically
	async function loadPapers(query: string) {
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
		loadPapers(query);
	});
	onDestroy(() => {
		unsubscribe();
	});

	$: isMobile = window.matchMedia('(max-width: 768px)').matches;

	function onSlideChange(event: CustomEvent) {
		activeIndex = event.detail[0].activeIndex;
		if (activeIndex >= papers.length - 6 && !isLoading) {
			offset += limit;
			loadPapers(query);
		}
	}
    async function handleAction(paper: Paper, action: string,) {
		if (action === 'view') {
			// Open paper in new tab    
			window.open(paper.pdfUrl, '_blank');
		} else if (action === 'like') {
			console.log('Liked paper:', paper.title);
			if (favourites.some((fav) => fav.id === paper.id)) {
				removeFromFavourites(paper.id);
			} else {
				addToFavourites({ title: paper.title, id: paper.id });
			}
		} else if (action === 'overlay') {
			const index = papers.findIndex((p) => p.id === paper.id);
			if (index !== -1) {
				papers[index] = { ...papers[index], overlay: !papers[index].overlay };
				papers = [...papers]; // Trigger reactivity by reassigning the array
			}
			console.log('Overlay:', paper.overlay);
		} else if (action === 'copy') {
			const type = "text/plain";
			const blob = new Blob([paper.pdfUrl], { type });
			const data = [new ClipboardItem({ [type]: blob })];
			await navigator.clipboard.write(data);
		} else if (action === 'settings') {
			const modal: ModalSettings = {
				type: 'prompt',
				title: 'Settings',
				body: 'Enter a new query to search for papers.',
				value: "",
				valueAttr: { type: 'text', minlength: 3, maxlength: 200, required: true },
				response: (query: string) => {
					if (query) {
						papers = [];
						loadPapers(query);
					}
				},
			};
			modalStore.trigger(modal);
		}
	}
</script>

<swiper-container
	direction={'vertical'}
    keyboard={true}
	mousewheel={true}
	on:swiperslidechange={onSlideChange}
	class="h-full w-full"
	spaceBetween={0}
	cssMode={true}
	slidesPerView={"auto"}
>
	{#if papers.length > 0}
		{#each papers as paper, paperIndex (paperIndex)}
			<swiper-slide class="sm:pt-4 sm:pb-2 sm:h-[95%] overflow-hidden">
				<div class="h-full">
					<div class="flex justify-center h-full">
						<PaperCard
							title={paper.title}
							authors={paper.authors}
							year={paper.year}
							tldr={paper.tldr}
							pdfUrl={paper.pdfUrl}
							overlay={paper.overlay}
							renderPdf={activeIndex - 1 <= paperIndex && paperIndex <= activeIndex + 5}
						/>
					</div>
					<div class="flex justify-center">
						<div class=" w-full max-w-2xl relative">
							<Actions isFavourite={favourites.some((fav) => fav.id === paper.id)} onAction={(action) => handleAction(paper, action)} />
					</div>
				</div>
			</div>
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
