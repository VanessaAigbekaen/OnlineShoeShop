<script>
    import { enhance } from '$app/forms';
    let { data } = $props();
    let product = data.product;
    let catName = data.categoryName;
    let added = $state(false);
    import { invalidateAll } from '$app/navigation';
    // The number is stored without decimal places, so format it.
    const euro = new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR'
    });

	function stars(rating){
		return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

	function formatDate(date) {
    	return new Date(date).toLocaleDateString('en-IE');
}
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
				<!-- Cart Button -->
				<form method="post" action="?/addToCart" class="mt-4" use:enhance={() => {added = true; return async () => {await invalidateAll();}; }}>

					<input type="hidden" name="productId" value={product.id} />

					<button type="submit" class="btn btn-success btn-lg" disabled={added || product.quantity === 0}>
						{#if added}
							<i class="bi bi-check-circle me-2"></i>
							Added
						{:else}
							<i class="bi bi-cart-plus me-2"></i>
							Add to Cart
						{/if}
					</button>
				</form>
				<!-- Back Button -->

				<a href="/products" class="btn btn-link px-0 mt-3">
					<i class="bi bi-arrow-left me-1"></i> Back to products
				</a>
			</div>
		</div>
	</div>
</div>
<hr class="my-4" />

<div class="row">
	<!-- LEFT: Review Form -->
	<div class="col-md-5">
    	{#if data.user}
        	<h4>{data.userReview ? 'Update Your Review' : 'Leave a Review'}</h4>

        	<form method="POST" action="?/submitReview" use:enhance class="card p-3 shadow-sm">
            	<input type="hidden" name="productId" value={product.id} />

            	<div class="mb-3">
                	<label for="rating" class="form-label">Rating</label>
                	<select id="rating" name="rating" class="form-select">
                    	<option value="5">5 ★★★★★</option>
                    	<option value="4">4 ★★★★</option>
                    	<option value="3">3 ★★★</option>
                    	<option value="2">2 ★★</option>
                    	<option value="1">1 ★</option>
                	</select>
            	</div>

            	<div class="mb-3">
                	<label for="comment" class="form-label">Comment</label>
                	<textarea id="comment" name="comment" class="form-control" rows="4">{data.userReview?.comment ?? ''}</textarea>
            	</div>

            	<button class="btn btn-primary">
                	{data.userReview ? 'Update Review' : 'Submit Review'}
            	</button>
        	</form>

        	{#if data.userReview}
            	<form method="POST" action="?/deleteReview" use:enhance class="mt-2">
                	<input type="hidden" name="reviewId" value={data.userReview.id} />
                	<button class="btn btn-outline-danger btn-sm">Delete My Review</button>
            	</form>
        	{/if}

    	{:else}
        	<div class="alert alert-info">
            	<a href="/auth/login">Log in</a> to leave a review.
        	</div>
    	{/if}
	</div>
   
    </div>

    <!-- RIGHT: Reviews List -->
    <div class="col-md-7">

        <h4>Customer Reviews</h4>

        <p>
            <strong>Average:</strong>
            {data.reviewCount > 0
                ? `${data.averageRating.toFixed(1)} / 5`
                : 'No reviews yet'}
        </p>

        {#if data.reviews.length === 0}
            <div class="alert alert-info">No reviews yet.</div>
        {:else}
            {#each data.reviews as r}
                <div class="card mb-2">
                    <div class="card-body">
                        <strong>{r.userName}</strong>
                        <div class="text-warning">{stars(r.rating)}</div>
                        <small class="text-muted">{formatDate(r.createdAt)}</small>

                        {#if r.comment}
                            <p class="mt-2 mb-0">{r.comment}</p>
                        {/if}
                    </div>
                </div>
            {/each}
        {/if}
</div>