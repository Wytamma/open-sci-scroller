import { goto } from '$app/navigation';

// Function to update the URL parameter
export function updateUrl(newQuery: string) {
    const params = new URLSearchParams(window.location.search);
    params.set('q', newQuery);
    goto(`?${params.toString()}`, { replaceState: true });
}