<script lang="ts">
	import '../app.postcss';
	import { initializeStores, Modal } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<Modal />
<slot />
