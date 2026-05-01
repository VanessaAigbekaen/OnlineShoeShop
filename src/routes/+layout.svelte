<script>
    import favicon from '$lib/assets/favicon.svg';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'bootstrap-icons/font/bootstrap-icons.min.css';
    import { search } from "$lib/stores/search";

    onMount(async () => {
        if (browser) {
            await import('bootstrap');
        }
    });

    let { children, data } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<header class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">

        <a class="navbar-brand fw-bold d-flex align-items-center" href="/">
            <i class="bi bi-shop-window me-2"></i>Leon's Shoe Shop
        </a>

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

        <div class="collapse navbar-collapse" id="navbarMain">

            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/products">Shop</a>
                </li>

                <!-- My Orders only for logged in non-admin users -->
                {#if data?.user && data.user.role !== 'admin'}
                    <li class="nav-item">
                        <a class="nav-link" href="/orders">
                            <i class="bi bi-bag me-1"></i>My Orders
                        </a>
                    </li>
                {/if}

                <!-- Admin only links -->
                {#if data?.user?.role === 'admin'}
                    <li class="nav-item">
                        <a class="nav-link" href="/categories">
                            <i class="bi bi-grid me-1"></i>Manage Categories
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/orders">
                            <i class="bi bi-bag me-1"></i>Manage Orders
                        </a>
                    </li>
                    <li class="nav-item">
						<a class="nav-link" href="/admin/products">
						  <i class="bi bi-shop me-1"></i>Manage Products
						</a>
					</li>
                     <li class="nav-item">
						<a class="nav-link" href="/admin/users">
							<i class="bi bi-people me-1"></i>Manage users
						</a>
					</li>
                {/if}
            </ul>

            <form class="d-flex me-3" role="search">
                <input
                    class="form-control me-2"
                    type="search"
                    placeholder="Search shoes..."
                    bind:value={$search}
                />
                <button class="btn btn-outline-light" type="submit" aria-label="Search">
                    <i class="bi bi-search"></i>
                </button>
            </form>

            <div class="d-flex align-items-center gap-3">

                <!-- Cart icon — hide for admin -->
                {#if data?.user?.role !== 'admin'}
                    <a href="/cart" class="text-white position-relative">
                        <i class="bi bi-cart3 fs-5"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {data.cartCount ?? 0}
                        </span>
                    </a>
                {/if}

                <!-- Wishlist -->
                <a href="/wishlist" class="text-white position-relative">
                    <i class="bi bi-heart fs-5"></i>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {data.wishlistCount ?? 0}
                    </span>
                </a>

                {#if data?.user}
                    <div class="dropdown">
                        <button
                            class="btn btn-outline-light btn-sm dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i class="bi bi-person-circle me-1"></i>{data.user.name}
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <a class="dropdown-item" href="/account">
                                    <i class="bi bi-person me-2"></i>My Account
                                </a>
                            </li>
                            {#if data.user.role !== 'admin'}
                                <li>
                                    <a class="dropdown-item" href="/orders">
                                        <i class="bi bi-bag me-2"></i>My Orders
                                    </a>
                                </li>
                            {/if}
                            <li><hr class="dropdown-divider" /></li>
                            <li>
                                <a class="dropdown-item text-danger" href="/auth/logout">
                                    <i class="bi bi-box-arrow-right me-2"></i>Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                {:else}
                    <a href="/auth/login" class="btn btn-outline-light btn-sm">
                        <i class="bi bi-box-arrow-in-right me-1"></i> Login
                    </a>
                {/if}

            </div>
        </div>
    </div>
</header>

<div class="container-xl my-4">
    {@render children()}
</div>

<footer class="bg-dark text-light mt-5 pt-4 pb-3">
  <div class="container">

    <div class="row">

      <!-- Brand -->
      <div class="col-md-4 mb-3">
        <h5 class="fw-bold">Leon's Shoe Shop</h5>
        <p class="small text-muted">
          Quality footwear for every occasion. Built as a modern e-commerce web application.
        </p>
      </div>

      <!-- Links -->
      <div class="col-md-4 mb-3">
        <h6 class="fw-semibold">Quick Links</h6>
        <ul class="list-unstyled small">
          <li><a href="/" class="text-decoration-none text-light">Home</a></li>
          <li><a href="/products" class="text-decoration-none text-light">Shop</a></li>
          <li><a href="/about" class="text-decoration-none text-light">About</a></li>
          <li><a href="/policy" class="text-decoration-none text-light">Policy</a></li>
        </ul>
      </div>

      <!-- Contact -->
      <div class="col-md-4 mb-3">
        <h6 class="fw-semibold">Contact</h6>
        <p class="small mb-1">📧 support@leonshoes.com</p>
        <p class="small mb-0">📍 Dublin, Ireland</p>
      </div>

    </div>

    <hr class="border-secondary" />

    <div class="text-center small text-muted">
      © {new Date().getFullYear()} Leon's Shoe Shop — Built with SvelteKit
    </div>

  </div>
</footer>