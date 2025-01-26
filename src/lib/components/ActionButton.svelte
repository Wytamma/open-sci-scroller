<script lang="ts">
	export let icon: typeof import('lucide-svelte').Eye; // Default icon type
	export let label: string; // Label for the action
	export let action: string; // Action identifier
	export let onClick: (action: string) => void; // Callback for the button click
</script>

<div class="flex flex-col items-center justify-center ">
    <button
        class="flex flex-col items-center justify-center p-3 rounded-full bg-slate-800 bg-opacity-40 hover:bg-slate-600 hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:click={() => onClick(action)}
        aria-label={label}
    >
        <svelte:component this={icon} class="w-7 h-7" />
    </button>
    <div class=" hidden sm:block">
        <span class="text-sm">{label}</span>
    </div>
</div>
