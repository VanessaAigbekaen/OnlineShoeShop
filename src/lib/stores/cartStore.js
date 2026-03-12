//This allows us to store a global variable for cart as it is dynamically changed
//All references of this is in documents.
import { derived, writable } from 'svelte/store';


const initialState = {
  items: [],
  total: 0};

function createCart() {
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    addItem: (product) =>
      update((state) => {
        const index = state.items.findIndex((item) => item.id === product.id);

        if (index !== -1) {
          state.items[index].quantity += 1;
        } else {
          state.items.push({ ...product, quantity: 1 });
        }

        state.total += product.price;
        return state;
      }),
    removeItem: (productId) =>
      update((state) => {
        const index = state.items.findIndex((item) => item.id === productId);

        if (index !== -1) {
          state.total -= state.items[index].price * state.items[index].quantity;
          state.items.splice(index, 1);
        }

        return state;
      }),
    clear: () => set({ items: [], total: 0}),
  };
}

export const cart = createCart();

export const cartCount = derived(cart, $cart => $cart.items.reduce((sum, item) => sum + item.quantity, 0))

// https://dev.to/dkthelearner/implementing-a-shopping-cart-functionality-with-svelte-16a8