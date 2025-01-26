<script lang="ts">
	export let title: string;
	export let authors: string;
	export let year: string;
	export let tldr: string | undefined;
	export let pdfUrl: string;
	export let renderPdf: boolean = true;
	export let overlay: boolean = true;
</script>

<div class="relative h-full w-full max-w-2xl sm:shadow-lg rounded-none sm:rounded-lg overflow-hidden bg-black">
	{#if renderPdf}
		<!-- Google Docs Viewer Embedded -->
		<iframe
		src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
		class="h-full w-full max-w-2xl"
		frameborder="0"
		title={title}
		scrolling="no"
		on:focus={() => console.log('PDF Viewer Focused')}
		></iframe>
	{/if}
	{#if overlay}
		<!-- Overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-black via-black via-20% to-transparent"></div>		
		<!-- Text Content -->
		<div class="absolute bottom-0 left-0 p-4 space-y-2 mr-12 md:mr-0">
			<div class="text-lg font-semibold text-white">{title}</div>
			<div class="text-sm text-gray-200">{authors}</div>
			<div class="text-sm text-gray-400">Year: {year}</div>
			{#if tldr}
				<div class="text-sm text-gray-300">{tldr}</div>
			{/if}

		</div>
	{/if}
</div>
