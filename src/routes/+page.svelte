<script lang="ts">
	import PaperSwiper from '$lib/components/PaperSwiper.svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { updateUrl } from '$lib/utils/updateUrl';


	let query = '';
	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'prompt',
		title: 'Open-Sci-Scroller',
		body: 'Enter a research topic to get started',
		value: '',
		valueAttr: { type: 'text', minlength: 3, maxlength: 200, required: true },
		response: (newQuery: string) => {
			if (newQuery) {
				query = newQuery;
				updateUrl(newQuery);
			}
		},
	};

	// Function to load query from URL
	function loadQueryFromUrl() {
		const params = new URLSearchParams(window.location.search);
		query = params.get('q') || '';
	}

	// Load the query when the component is mounted
	onMount(() => {
		loadQueryFromUrl();
		if (!query) {
			modalStore.trigger(modal);
		}
	});
</script>

{#if query}
	<PaperSwiper {query} />
{:else}
	<button type="button" class="flex h-full w-full justify-center align-middle items-center text-center text-gray-500" on:click={() => modalStore.trigger(modal)}>
		Enter a query to begin.
	</button>
{/if}
