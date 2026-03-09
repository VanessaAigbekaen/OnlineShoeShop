//This allows us to store a global variable for search as it is dynamically changed
//All references of this is in documents.
import { writable } from 'svelte/store';
export const search = writable("");