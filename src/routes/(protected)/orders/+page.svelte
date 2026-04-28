<script>
  let { data } = $props();

  const euro = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR'
  });
</script>

<div class="container py-5">
  <h2 class="mb-4 fw-bold">
    <i class="bi bi-bag-check me-2"></i>Your Orders
  </h2>

  {#if data.orders.length === 0}
    <div class="text-center py-5">
      <i class="bi bi-box-seam" style="font-size: 4rem; color: #ccc;"></i>
      <h5 class="mt-3 text-muted">No orders yet</h5>
      <a href="/products" class="btn btn-dark mt-3">
        <i class="bi bi-arrow-left me-1"></i> Start Shopping
      </a>
    </div>
  {:else}
    <div class="row g-4">
      {#each data.orders as order}
        <div class="col-md-6 col-lg-4">
          <div class="card shadow-sm border-0 h-100 order-card">
            
            <div class="card-body d-flex flex-column">

              <!-- Order ID -->
              <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="fw-bold mb-0">Order #{order.id}</h6>
                <span class="badge bg-success">Paid</span>
              </div>

              <!-- Date -->
              <p class="text-muted small mb-3">
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <!-- Total -->
              <h5 class="fw-bold mb-4">
                {euro.format(order.total)}
              </h5>

              <!-- Action -->
              <div class="mt-auto">
                <a href={`/orders/${order.id}/confirmation`} class="btn btn-outline-dark w-100">
                  View Details
                </a>
              </div>

            </div>

          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .order-card {
    border-radius: 16px;
    transition: all 0.2s ease;
  }

  .order-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
</style>