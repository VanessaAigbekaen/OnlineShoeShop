<script>
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	// Browser used to test if client or server side
	import { browser } from '$app/environment';
	import 'bootstrap/dist/css/bootstrap.min.css'
	import 'bootstrap-icons/font/bootstrap-icons.min.css';
	import { cartCount } from '$lib/stores/cart';
  import { search } from "$lib/stores/search";
  import { category } from "$lib/stores/categories";

  onMount( async () => {
		if (browser) {
			// if running in the browser, load Bootstrap
			console.log("Loading Bootstrap");
			await import('bootstrap');
		}
	})

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<!-- Header with Navbar -->
<header class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
  <div class="container">

    <!-- Logo -->
    <a class="navbar-brand fw-bold d-flex align-items-center" href="/">
      <i class="bi bi-shop-window me-2"></i>Leon's Shoe Shop
    </a>

    <!-- Mobile Toggle -->
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarMain"
      aria-controls="navbarMain"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Navbar Content -->
    <div class="collapse navbar-collapse" id="navbarMain">

      <!-- Left Links -->
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/products">Shop</a>
        </li>
    <li class="nav-item dropdown">
    
    <!-- Category dropdown menu -->	
    <a
      class="nav-link dropdown-toggle"
      href=" #"
      id="categoriesDropdown"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      Categories
    </a>

    <ul class="dropdown-menu">
      <li><button class="dropdown-item" onclick={() => category.set("Casual")}>Casual</button></li>
      <li><button class="dropdown-item" onclick={() => category.set("Formal")}>Formal</button></li>
      <li><button class="dropdown-item" onclick={() =>category.set("Sporty")}>Sporty</button></li>
      <li><button class="dropdown-item" onclick={() =>category.set("")}>All</button></li>
    </ul>
    </li>
      </ul>

      <!-- Search Bar -->
      <form class="d-flex me-3" role="search">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Search shoes..."
          bind:value={$search}
        />
        <button class="btn btn-outline-light" type="submit" aria-label = "Search">
      <i class="bi bi-search"></i>
    </button>
      </form>

      <!-- Right Icons -->
      <div class="d-flex align-items-center gap-3">

        <!-- Cart -->
        <a href="/cart" class="text-white position-relative">
          <i class="bi bi-cart3 fs-5"></i>
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {$cartCount}
          </span>
        </a>

        <!-- User -->
        <a href="/user" class="text-white position-relative" aria-label = "Shopping Cart">
          <i class="bi bi-person-circle fs-5"></i>
        </a>

      </div>
    </div>
  </div>
</header>
{@render children()}