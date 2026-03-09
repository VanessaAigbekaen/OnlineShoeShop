//This allows us to store a global variable for cart as it is dynamically changed
//All references of this is in documents.
import { writable } from 'svelte/store';
export const cartCount = writable(0);