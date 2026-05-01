<script>
    import { enhance } from '$app/forms';
    let { data } = $props();
</script>

<div class="container py-5">
    <h2 class="mb-4"><i class="bi bi-heart me-2"></i>Your Wishlist</h2>

    {#if data.items.length === 0}
        <div class="text-center py-5">
            <i class="bi bi-heart" style="font-size: 4rem; color: #ccc;"></i>
            <h4 class="mt-3 text-muted">Your wishlist is empty</h4>
            <a href="/products" class="btn btn-dark mt-3">
                <i class="bi bi-arrow-left me-1"></i> Continue Shopping
            </a>
        </div>

    {:else}
        <div class="row g-4">
            <div class="col-lg-8">
                {#each data.items as item}
                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <div class="row align-items-center">

                                <!-- Product Image -->
                                <div class="col-3 col-md-2">
                                    <img
                                        src={"/productImage/" + item.image}
                                        alt={item.name}
                                        class="img-fluid rounded"
                                        style="max-height: 80px; object-fit: contain;"
                                    />
                                </div>

                                <!-- Product Info -->
                                <div class="col-9 col-md-6">
                                    <h6 class="mb-1 fw-bold">{item.name}</h6>
                                    <p class="text-muted mb-0">€{item.unitPrice.toFixed(2)}</p>
                                </div>

                                <!-- Move to Cart -->
                                <div class="col-6 col-md-2 mt-3 mt-md-0">
                                    <form method="post" action="?/moveToCart" use:enhance>
                                        <input type="hidden" name="productId" value={item.productId} />
                                        <button class="btn btn-sm btn-dark w-100" type="submit">
                                            <i class="bi bi-cart-plus me-1"></i> Add to Cart
                                        </button>
                                    </form>
                                </div>

                                <!-- Similar Products -->
                                <div class="col-6 col-md-2 mt-3 mt-md-0">
                                    <a href={`/products?categoryId=${item.categoryId}`} class="btn btn-sm btn-outline-secondary w-100">
                                    <i class="bi bi-grid me-1"></i> Similar products</a>
                                </div>

                                <div class="col-12 mt-2">
                                    <div class="d-flex gap-2 align-items-center">

                                    <!-- Delete -->
                                    <form method="post" action="?/removeItem" use:enhance>
                                        <input type="hidden" name="productId" value={item.productId} />
                                            <button class="btn btn-sm btn-outline-danger" type="submit">
                                                <i class="bi bi-trash"></i>
                                            </button>
                                        </form>

                                    <!-- Note -->
                                    <form method="post" action="?/updateNote" class="flex-grow-1"
                                        use:enhance={() => {
                                            return ({ update }) => update({ reset: false });
                                        }}
                                    >
                                        <input type="hidden" name="productId" value={item.productId} />
                                            <div class="input-group input-group-sm">
                                                <input type="text" class="form-control" name="note" placeholder="Add a note!" value={item.note ?? ''} />
                                                <button class="btn btn-sm btn-outline-secondary" type="submit">
                                                    <i class="bi bi-save me-1"></i>Save Note
                                                </button>
                                            </div>
                                        </form>

                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Summary -->
            <div class="col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title mb-4">Wishlist Summary</h5>

                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Items wishlisted</span>
                            <span>{data.items.length}</span>
                        </div>

                        <hr />

                        <a href="/products" class="btn btn-outline-secondary w-100 mt-2">
                            <i class="bi bi-arrow-left me-1"></i> Continue Shopping
                        </a>
                    </div>
                </div>
            </div>

        </div>
    {/if}
</div>