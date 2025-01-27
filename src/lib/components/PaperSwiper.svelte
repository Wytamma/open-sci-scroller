<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import PaperCard from './PaperCard.svelte';
	import { fetchPapers } from '$lib/utils/fetchPapers';
    import { register } from 'swiper/element/bundle';
    import Actions from './Actions.svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { queryStore, addToFavourites, removeFromFavourites } from '$lib/stores/queryStore';
	import { updateUrl } from '$lib/utils/updateUrl';

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
	let modal: ModalSettings;
	$: if (query) {
		modal = {
				type: 'prompt',
				title: 'New Search',
				body: 'Enter a new query to find related papers',
				value: query,
				valueAttr: { type: 'text', minlength: 3, maxlength: 200, required: true },
				response: (newQuery: string) => {
					if (newQuery) {
						query = newQuery;
						updateUrl(query);
						loadPapers(query, true);
					}
				},
			};
		}

	// Fetch papers dynamically
	async function loadPapers(query: string, reset = false) {
		try {
			isLoading = true;
			if (reset) {
				offset = 0;
				papers = [];
				errorMessage = '';
			}
			const newPapers = await fetchPapers(query, offset, limit).catch((error) => {
				errorMessage = error.message;
				throw error;
			});
			if (newPapers.length === 0) {
				errorMessage = 'No more papers found. Click here to update your search.';
			}
			papers = [...papers, ...newPapers];
			if (papers.length === 0) {
				errorMessage = 'No papers found. Click here to update your search.';
			}
		} catch (error) {
			console.error(error);
			isLoading = false;
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
	{#if isLoading && papers.length === 0}
		<swiper-slide class="flex justify-center items-center text-gray-400 text-lg font-semibold">
			Loading papers...	
		</swiper-slide>
	{/if}
	{#each papers as paper, paperIndex (paperIndex)}
			<swiper-slide class="sm:pt-4 sm:h-[96%] overflow-hidden">
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
	{#if errorMessage}
		<swiper-slide class="flex justify-center items-center text-gray-400 text-lg font-semibold">
			<button type="button" class="flex h-full w-full justify-center align-middle items-center text-center" on:click={() => modalStore.trigger(modal)}>
				{errorMessage}
			</button>
		</swiper-slide>
	{/if}
</swiper-container>
