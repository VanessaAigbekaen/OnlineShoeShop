<script>
    import { enhance } from '$app/forms';
    import ProductForm from '$lib/components/ProductForm.svelte';
    import { slide, fade } from 'svelte/transition';
    import { cart } from '$lib/stores/cartStore.js';
    import { search } from "$lib/stores/search";
    import { category } from "$lib/stores/categories";

    export let data;

    // ── Cart ─
    function addToCart(product) {
        cart.addItem(product);
    }

    // ── Category sidebar filter 
    let selectedCatId = null;

    function filterByCat(catId) {
        selectedCatId = catId === null ? null : Number(catId);
    }

    // ── Filtered products (search + category store + sidebar) ──
    $: filteredProducts = data.products
        .filter(p => p.name.toLowerCase().includes($search.toLowerCase()))
        .filter(p => !$category || p.category === $category)
        .filter(p => selectedCatId === null || p.categoryId === selectedCatId);

    // ── Add / Edit form ─
    let showForm = false;
    let selectedProduct = null;

    function handleAddNew() {
        selectedProduct = null;
        showForm = true;
    }

    function handleUpdate(prod) {
        selectedProduct = prod;
        showForm = true;
    }

    // ── Delete modal ──
    let productToDelete = null;
    let showDeleteModal = false;
    let modalDeleteError = '';

    function openDeleteModal(prod) {
        productToDelete = prod;
        showDeleteModal = true;
        modalDeleteError = '';
    }

    function closeDeleteModal() {
        showDeleteModal = false;
        productToDelete = null;
        modalDeleteError = '';
    }

    function enhanceDeleteModal() {
        return async ({ result, update }) => {
            if (!result) return;
            if (result.type === 'success') {
                closeDeleteModal();
                await update();
            }
            if (result.type === 'failure') {
                modalDeleteError = result.data?.errors?.general || 'Delete failed';
            }
        };
    }
</script>

<svelte:head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shoe Shop</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <link rel="stylesheet" href="/css/style.css">
</svelte:head>

<div class="container-fluid">
    <div class="row">

        <!-- ── Sidebar ── -->
        <div class="col-sm-2 pt-4">
            <div class="list-group mb-3">
                <button
                    class="list-group-item list-group-item-action {selectedCatId === null ? 'active' : ''}"
                    on:click={() => filterByCat(null)}
                >
                    All
                </button>

                {#each data.categories as cat}
                    <button
                        class="list-group-item list-group-item-action {selectedCatId === Number(cat.id) ? 'active' : ''}"
                        on:click={() => filterByCat(cat.id)}
                    >
                        {cat.name}
                    </button>
                {/each}
            </div>
            
            {#if data.user?.role === 'admin'}
                <button type="button" class="btn btn-success w-100" on:click={handleAddNew}>
                    <i class="bi bi-plus-circle"></i> Add New Product
                </button>
            {/if}
        </div>

        <!-- ── Main content ── -->
        <div class="col-sm-10">

            <!-- Add/Edit form -->
            {#if showForm}
                <div transition:slide={{ duration: 400 }}>
                    <ProductForm
                        product={selectedProduct}
                        // categories={data.categories}
                        onCancel={() => {
                            showForm = false;
                            selectedProduct = null;
                        }}
                    />
                    <hr class="my-4" />
                </div>
            {/if}

            <!-- ── Product cards ── -->
            <div class="row">
                {#each filteredProducts as product (product.id)}
                    <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div class="product-card h-100">

                            <div class="product-image">
                                <img src={"/productImage/" + product.image} alt={product.name}>
                            </div>

                            <div class="product-info">
                                <h4 class="product-title">
                                    <a href={`/products/${product.id}`}>{product.name}</a>
                                </h4>
                                <p class="product-desc">{product.description}</p>
                                <h5 class="product-price">${product.price}</h5>

                                <button class="cart" on:click={() => addToCart(product)}>
                                    Add To Cart
                                </button>

                                <!-- Edit / Delete -->
                                {#if data.user?.role === 'admin'}
                                    <div class="mt-2 d-flex gap-1 justify-content-center">
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-primary"
                                            on:click={() => handleUpdate(product)}
                                        >
                                            <i class="bi bi-pencil"></i> Edit
                                        </button>

                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-danger"
                                            on:click={() => openDeleteModal(product)}
                                        >
                                            <i class="bi bi-trash"></i> Delete
                                        </button>
                                    </div>
                                {/if}
                            </div>

                        </div>
                    </div>
                {/each}
            </div>

        </div>
    </div>
</div>

<!-- ── Delete modal ── -->
{#if showDeleteModal}
    <div
        class="modal d-block"
        tabindex="-1"
        style="background: rgba(0,0,0,0.5); z-index: 1050;"
        transition:fade
    >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title">Confirm Delete</h5>
                    <button type="button" class="btn-close" on:click={closeDeleteModal}></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>?</p>
                    {#if modalDeleteError}
                        <div class="alert alert-danger">{modalDeleteError}</div>
                    {/if}
                </div>
                <div class="modal-footer">
                    <form method="POST" action="?/deleteProduct" use:enhance={enhanceDeleteModal}>
                        <input type="hidden" name="prodId" value={productToDelete?.id} />
                        <button type="submit" class="btn btn-danger">Yes, Delete</button>
                        <button type="button" class="btn btn-secondary" on:click={closeDeleteModal}>
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
{/if}