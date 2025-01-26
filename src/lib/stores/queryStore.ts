import { writable } from 'svelte/store';

interface Paper {
    id: string;
    title: string;
}

interface StoreState {
    query: string;
    favourites: Paper[];
}

// Utility functions for local storage
const LOCAL_STORAGE_KEY = 'queryStore';

const loadFromLocalStorage = (): StoreState => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { query: '', favourites: [] };
};

const saveToLocalStorage = (state: StoreState) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};

// Load initial state from local storage
const initialState: StoreState = loadFromLocalStorage();

// Create a writable store
export const queryStore = writable<StoreState>(initialState);

// Subscribe to the store to sync with local storage
queryStore.subscribe((state) => {
    saveToLocalStorage(state);
});

// Utility function for updating the query
export const updateQuery = (query: string) => {
    queryStore.update((state) => {
        state.query = query;
        return state;
    });
};

// Utility functions for managing favourites
export const addToFavourites = (paper: Paper) => {
    queryStore.update((state) => {
        if (!state.favourites.find((fav) => fav.id === paper.id)) {
            state.favourites.push(paper);
        }
        return state;
    });
};

export const removeFromFavourites = (paperId: string) => {
    queryStore.update((state) => {
        state.favourites = state.favourites.filter((fav) => fav.id !== paperId);
        return state;
    });
};
