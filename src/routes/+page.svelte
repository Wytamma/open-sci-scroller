<script lang="ts">
	import ModalPrompt from '$lib/components/ModalPrompt.svelte';
	import PaperSwiper from '$lib/components/PaperSwiper.svelte';

	let query = '';

	function handleQuerySubmit(newQuery: string) {
		query = newQuery;
	}
</script>

<ModalPrompt onQuerySubmit={handleQuerySubmit} />

{#if query}
	<PaperSwiper {query} />
{:else}
	<p class="text-center text-gray-500 ">Enter a query to begin.</p>
{/if}
