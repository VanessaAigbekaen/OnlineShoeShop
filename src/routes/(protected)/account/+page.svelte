<script>
    let { data } = $props();
</script>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow-sm">
                <div class="card-body p-4">

                    <div class="text-center mb-4">
                        <i class="bi bi-person-circle" style="font-size: 4rem;"></i>
                        <h3 class="mt-2">{data.user.name}</h3>
                        <span class="badge bg-dark">{data.user.role}</span>
                    </div>

                    <dl class="row">
                        <dt class="col-4">Email:</dt>
                        <dd class="col-8">{data.user.email}</dd>

                        <dt class="col-4">Date of Birth:</dt>
                        <dd class="col-8">{data.user.dob ?? 'Not set'}</dd>

                        <dt class="col-4">Member since:</dt>
                        <dd class="col-8">{new Date(data.user.createdAt).toLocaleDateString()}</dd>
                    </dl>

                    <a href="/auth/logout" class="btn btn-dark w-100 mt-3">
                        <i class="bi bi-box-arrow-right me-1"></i> Logout
                    </a>

                </div>
            </div>
        </div>
    </div>
</div>