<script lang="ts">
	import { Link, Share, Settings, Heart } from 'lucide-svelte'; // Example icons, replace with your preferred icons

	export let onAction: (action: string) => void; // Callback for handling action clicks
</script>

<div
	class="flex-col absolute bottom-4 right-2 space-y-5 p-0 text-white"
	aria-label="Actions"
>
    <button
        class="flex items-center justify-center p-2 bg-slate-800 bg-opacity-70 rounded-full hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:click={() => onAction('like')}
        aria-label="Like"
        >
        <Heart class="w-5 h-5" />
        </button>
	<button
		class="flex items-center justify-center p-2 bg-slate-800 bg-opacity-70 rounded-full hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
		on:click={() => onAction('view')}
		aria-label="View"
	>
		<Link class="w-5 h-5" />
	</button>
	<button
		class="flex items-center justify-center p-2 bg-slate-800  bg-opacity-70 rounded-full hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
		on:click={() => onAction('share')}
		aria-label="Share"
	>
		<Share class="w-5 h-5" />
	</button>
	<button
		class="flex items-center justify-center p-2 bg-slate-800 bg-opacity-70 rounded-full hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
		on:click={() => onAction('settings')}
		aria-label="Settings"
	>
		<Settings class="w-5 h-5" />
	</button>
</div>
