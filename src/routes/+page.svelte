<script lang="ts">
	import ModalPrompt from '$lib/components/ModalPrompt.svelte';
	import PaperSwiper from '$lib/components/PaperSwiper.svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';
	let query = '';


	const modalStore = getModalStore();
	const modal: ModalSettings = {
		type: 'prompt',
		title: 'Open-Sci-Scroller',
		body: 'Enter a research topic to get started.',
		value: '',
		valueAttr: { type: 'text', minlength: 3, maxlength: 200, required: true },
		response: (newQuery: string) => {
			if (newQuery) {
				query = newQuery;
			}
		},
	};

	onMount(() => {
		modalStore.trigger(modal);
	});


</script>

{#if query}
	<PaperSwiper {query} />
{:else}
	<button type="button" class="flex h-full w-full justify-center align-middle items-center text-center text-gray-500" on:click={() => modalStore.trigger(modal)}>Enter a query to begin.</button>
{/if}
