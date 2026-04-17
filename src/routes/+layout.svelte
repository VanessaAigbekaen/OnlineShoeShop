<script>
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	// Browser used to test if client or server side
	import { browser } from '$app/environment';
	import 'bootstrap/dist/css/bootstrap.min.css'
	import 'bootstrap-icons/font/bootstrap-icons.min.css';
	import { cartCount } from '$lib/stores/cartStore';
  import { search } from "$lib/stores/search";
  import { category } from "$lib/stores/categories";
  import { cart } from '$lib/stores/cartStore';
  import { ROLES } from "$lib/constants/roles";
	import AdminMenu from '$lib/components/AdminMenu.svelte';
	import MainMenu from '$lib/components/MainMenu.svelte';

  onMount( async () => {
		if (browser) {
			// if running in the browser, load Bootstrap
			console.log("Loading Bootstrap");
			await import('bootstrap');
		}
	})

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Render menu based on role -->
{#if data.user && (data.user.role === ROLES.ADMIN)}
  <AdminMenu {data} />
{:else}
  <MainMenu { data } />
{/if}

<div class="container-xl bd-gutter my-md-4 bd-layout">
  {@render children()}
</div>