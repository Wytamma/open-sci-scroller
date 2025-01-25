<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	export let onQuerySubmit: (query: string) => void;

	const modalStore = getModalStore();
	const modal: ModalSettings = {
		type: 'prompt',
		title: 'Enter Query',
		body: 'Please enter your search query:',
		value: '',
		valueAttr: { type: 'text', minlength: 3, maxlength: 200, required: true },
		response: (query: string) => {
			if (query) onQuerySubmit(query);
		},
	};

	// Trigger modal on mount
	modalStore.trigger(modal);
</script>
