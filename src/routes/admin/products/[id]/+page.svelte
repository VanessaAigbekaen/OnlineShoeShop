<script>

    let { data } = $props();
    
    const product = $derived(data.product);
    const catName = $derived(data.categoryName);

    // The number is stored without decial places, so format it.
    const euro = new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR'
    });

</script>

<h3>Product Details</h3>
<div class="card shadow-sm my-4">
    <div class="row g-0">
        <!-- Image Column -->
        <div class="col-12 col-md-5 text-center p-3">
            <img 
                src={`/productImage/${product.image}`} 
                alt={product.name} 
                class="img-fluid rounded" 
                style="max-height: 400px; object-fit: contain;"
            />
        </div>

        <!-- Details Column -->
        <div class="col-12 col-md-7">
            <div class="card-body">
                <!-- Product Name -->
                <h3 class="card-title mb-4">{product.name}</h3>

                <!-- Product Details -->
                <dl class="row mb-0">
                    <dt class="col-4 fw-semibold">Description:</dt>
                    <dd class="col-8">{product.description}</dd>

                    <dt class="col-4 fw-semibold">Price:</dt>
                    <dd class="col-8">{euro.format(product.price)}</dd>

                    <dt class="col-4 fw-semibold">Quantity:</dt>
                    <dd class="col-8">{product.quantity}</dd>

                    <dt class="col-4 fw-semibold">Category:</dt>
                    <dd class="col-8">{catName}</dd>
                </dl>

                <!-- Back Button -->
                <a href="/products" class="btn btn-link px-0 mt-3">
                    <i class="bi bi-arrow-left me-1"></i> Back to products
                </a>
            </div>
        </div>
    </div>
</div>