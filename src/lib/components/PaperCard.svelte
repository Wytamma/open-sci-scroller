<script lang="ts">
	export let title: string;
	export let authors: string;
	export let year: string;
	export let tldr: string | undefined;
	export let pdfUrl: string;
</script>

<div class="relative h-full rounded-lg shadow overflow-hidden">
	<!-- Google Docs Viewer Embedded -->
	<iframe
		src={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&pid=explorer&efh=false&a=v&chrome=false&embedded=true`}
		class="w-full h-full"
		frameborder="0"
		title={title}
		scrolling="no"
		on:focus={() => console.log('PDF Viewer Focused')}
	></iframe>

	<!-- Gradient Overlay -->
	<div class="absolute inset-0 bg-gradient-to-t from-black via-black via-20% to-transparent"></div>
	 

	<!-- Text Content -->
	<div class="absolute bottom-0 left-0 p-4 space-y-2 z-10 mr-8">
		<div class="text-lg font-semibold text-white">{title}</div>
		<div class="text-sm text-gray-200">{authors}</div>
		<div class="text-sm text-gray-400">Year: {year}</div>
		{#if tldr}
			<div class="text-sm text-gray-300">{tldr}</div>
		{/if}
	</div>
</div>
