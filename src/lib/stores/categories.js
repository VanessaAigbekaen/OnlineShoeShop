//This allows us to store a global variable for categories as it is dynamically changed
//All references of this is in documents.
import { writable } from 'svelte/store';
export const category = writable("");