<script>
    import { enhance } from '$app/forms';
    import { invalidateAll } from '$app/navigation';
    let { data } = $props();
</script>

<div class="container py-5">
    <h2 class="mb-4"><i class="bi bi-cart3 me-2"></i>Your Cart</h2>

    {#if data.items.length === 0}
        <div class="text-center py-5">
            <i class="bi bi-cart-x" style="font-size: 4rem; color: #ccc;"></i>
            <h4 class="mt-3 text-muted">Your cart is empty</h4>
            <a href="/products" class="btn btn-dark mt-3">
                <i class="bi bi-arrow-left me-1"></i> Continue Shopping
            </a>
        </div>

    {:else}
        <div class="row g-4">

            <!-- Cart Items -->
            <div class="col-lg-8">
                {#each data.items as item}
                    <div class="card mb-3 shadow-sm">
                        <div class="card-body">
                            <div class="row align-items-center">

                                <!-- Product Image -->
                                <div class="col-3 col-md-2">
                                    <img
                                        src={"/productImage/"+item.image}
                                        alt={item.name}
                                        class="img-fluid rounded"
                                        style="max-height: 80px; object-fit: contain;"
                                    />
                                </div>

                                <!-- Product Info -->
                                <div class="col-9 col-md-4">
                                    <h6 class="mb-1 fw-bold">{item.name}</h6>
                                    <p class="text-muted mb-0">€{item.unitPrice.toFixed(2)} each</p>
                                </div>

                                <!-- Update Quantity -->
                                <div class="col-md-3 mt-3 mt-md-0">
                                    <form method="post" action="?/updateQuantity" use:enhance>
                                        <input type="hidden" name="cartItemId" value={item.id} />
                                        <div class="input-group input-group-sm">
                                            <input
                                                type="number"
                                                name="quantity"
                                                min="1"
                                                value={item.quantity}
                                                class="form-control text-center"
                                                style="max-width: 70px;"
                                            />
                                            <button class="btn btn-outline-secondary" type="submit">
                                                Update
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <!-- Item Total -->
                                <div class="col-6 col-md-2 mt-3 mt-md-0 text-center">
                                    <span class="fw-bold">€{(item.unitPrice * item.quantity).toFixed(2)}</span>
                                </div>

                                <!-- Remove -->
                                <div class="col-6 col-md-1 mt-3 mt-md-0 text-end">
                                    <form method="post" action="?/removeItem" use:enhance>
                                        <input type="hidden" name="cartItemId" value={item.id} />
                                        <button class="btn btn-sm btn-outline-danger" type="submit">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Order Summary -->
            <div class="col-lg-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title mb-4">Order Summary</h5>

                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Items ({data.items.length})</span>
                            <span>€{data.total.toFixed(2)}</span>
                        </div>

                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Shipping</span>
                            <span class="text-success">Free</span>
                        </div>

                        <hr />

                        <div class="d-flex justify-content-between mb-4">
                            <span class="fw-bold fs-5">Total</span>
                            <span class="fw-bold fs-5">€{data.total.toFixed(2)}</span>
                        </div>

                        <form method="post" action="?/checkout" use:enhance>
                            <button class="btn btn-dark w-100 py-2">
                                <i class="bi bi-bag-check me-2"></i>Checkout
                            </button>
                        </form>

                        <a href="/products" class="btn btn-outline-secondary w-100 mt-2">
                            <i class="bi bi-arrow-left me-1"></i> Continue Shopping
                        </a>
                    </div>
                </div>
            </div>

        </div>
    {/if}
</div>