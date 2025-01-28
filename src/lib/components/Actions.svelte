<script lang="ts">
	import { Download, Search, Heart, Eye, EyeOff, ClipboardCopy, ClipboardCheck } from 'lucide-svelte';
	import ActionButton from './ActionButton.svelte'; // Adjust the path as necessary
	
	export let onAction: (action: string) => void; // Callback for handling action clicks
	export let isFavourite: boolean; // Favourite state
	
	let overlay: boolean = true; // Overlay state
	let copied: boolean = false; // Copied state
</script>

<div
	class="flex flex-col absolute bottom-6 md:bottom-0 right-2 md:-right-16 space-y-7 md:space-y-5 p-0 text-white"
	aria-label="Actions"
>
	<ActionButton
		icon={overlay ? Eye : EyeOff}
		label="Read"
		action="overlay"
		onClick={(action) => {
			onAction(action);
			overlay = !overlay;
		}}
	/>
	<div class={isFavourite ? 'text-red-500' : 'text-white}'}>
		<ActionButton
			icon={Heart}
			label="Like"
			action="like"
			onClick={onAction}
		/>
	</div>
	<ActionButton
		icon={Download}
		label="Save"
		action="save"
		onClick={onAction}
	/>
	<ActionButton
		icon={copied ? ClipboardCheck : ClipboardCopy}
		label="Copy"
		action="copy"
		onClick={(action) => {
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
			onAction(action);
		}}
	/>
	<ActionButton
		icon={Search}
		label="Search"
		action="settings"
		onClick={onAction}
	/>
</div>
