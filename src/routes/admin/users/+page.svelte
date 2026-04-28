<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	/**
	 * Users are loaded from +page.server.js
	 */
	let { data } = $props();

	/**
	 * Which row is currently in edit mode?
	 */
	let editingId = $state(null);

	/**
	 * Page-level message for create/update failures
	 */
	let pageError = $state('');

	/* =========================
	   Edit mode helpers
	========================= */
	function edit(id) {
		editingId = id;
		pageError = '';
	}

	function cancel() {
		editingId = null;
		pageError = '';
	}

	/* =========================
	   Generic enhanced handler
	   - success: close edit + refresh data
	   - failure: show message
	========================= */
	function enhanced() {
		return async ({ result }) => {
			if (!result) return;

			if (result.type === 'success') {
				pageError = '';
				editingId = null;
				await invalidateAll();
			}

			if (result.type === 'failure') {
				pageError =
					result.data?.errors?.general ||
					result.data?.message ||
					'Operation failed';
			}
		};
	}

	/* =========================
	   Delete modal state
	========================= */
	let userToDelete = $state(null);
	let showDeleteModal = $state(false);
	let modalDeleteError = $state('');

	function openDeleteModal(user) {
		userToDelete = user;
		showDeleteModal = true;
		modalDeleteError = '';
		pageError = '';
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		userToDelete = null;
		modalDeleteError = '';
	}

	function enhanceDeleteModal() {
		return async ({ result }) => {
			if (!result) return;

			if (result.type === 'success') {
				closeDeleteModal();
				await invalidateAll();
			}

			if (result.type === 'failure') {
				modalDeleteError =
					result.data?.errors?.general ||
					result.data?.message ||
					result.data?.error ||
					'Delete failed';
			}
		};
	}

	/* =========================
	   Reset password modal state
	========================= */
	let userToReset = $state(null);
	let showResetModal = $state(false);
	let modalResetError = $state('');
	let modalResetSuccess = $state('');

	function openResetModal(user) {
		userToReset = user;
		showResetModal = true;
		modalResetError = '';
		modalResetSuccess = '';
		pageError = '';
	}

	function closeResetModal() {
		showResetModal = false;
		userToReset = null;
		modalResetError = '';
		modalResetSuccess = '';
	}

	function enhanceResetModal() {
		return async ({ result }) => {
			if (!result) return;

			if (result.type === 'success') {
				modalResetSuccess = 'Password successfully reset';
				modalResetError = '';
				await invalidateAll();
				setTimeout(() => {
					closeResetModal();
					modalResetSuccess = '';
				}, 1500);
			}

			if (result.type === 'failure') {
				modalResetError =
					result.data?.errors?.general ||
					result.data?.message ||
					result.data?.error ||
					'Password reset failed';
			}
		};
	}
</script>

<h3>Users</h3>

{#if pageError}
	<div class="alert alert-danger">{pageError}</div>
{/if}

<table class="table table-bordered w-100 align-middle">
	<thead>
		<tr>
			<th>ID</th>
			<th>Name</th>
			<th>DOB - Year/Month/Day</th>
			<th>Email</th>
			<th>Role</th>
			<th>Email Verified</th>
			<th>Actions</th>
		</tr>
	</thead>

	<tbody>
		{#each data.users as u (u.id)}
			<tr>
				<td>{u.id}</td>

				<td>
					{#if editingId === u.id}
						<input
							class="form-control"
							name="name"
							form={`edit-${u.id}`}
							value={u.name}
							required
						/>
					{:else}
						{u.name}
					{/if}
				</td>

				<td>
					{#if editingId === u.id}
						<input
							class="form-control"
							name="dob"
							type="date"
							form={`edit-${u.id}`}
							value={u.dob ?? ''}
						/>
					{:else}
						{u.dob ?? '—'}
					{/if}
				</td>

				<td>
					{#if editingId === u.id}
						<input
							class="form-control"
							name="email"
							type="email"
							form={`edit-${u.id}`}
							value={u.email}
							required
						/>
					{:else}
						{u.email}
					{/if}
				</td>

				<td>
					{#if editingId === u.id}
						<select class="form-select" name="role" form={`edit-${u.id}`}>
							<option value="user" selected={u.role === 'user'}>user</option>
							<option value="admin" selected={u.role === 'admin'}>admin</option>
						</select>
					{:else}
						{u.role}
					{/if}
				</td>

				<td>{u.emailVerified ? 'yes' : 'no'}</td>

				<td>
					{#if editingId === u.id}
						<!-- Update existing user -->
						<form
							id={`edit-${u.id}`}
							method="POST"
							action="?/updateUser"
							use:enhance={enhanced}
							class="d-inline"
						>
							<input type="hidden" name="id" value={u.id} />
							<button type="submit" class="btn btn-sm btn-success">✓</button>
							<button type="button" class="btn btn-sm btn-secondary ms-1" onclick={cancel}>
								✕
							</button>
						</form>
					{:else}
						<!-- Enter edit mode -->
						<button
							type="button"
							class="btn btn-sm btn-outline-primary"
							onclick={() => edit(u.id)}
							title="Edit user"
						>
							✎
						</button>

						<!-- Open reset password modal -->
						<button
							type="button"
							class="btn btn-sm btn-outline-warning ms-1"
							onclick={() => openResetModal(u)}
							title="Reset password"
						>
							🔑
						</button>

						<!-- Open delete modal -->
						<button
							type="button"
							class="btn btn-sm btn-outline-danger ms-1"
							onclick={() => openDeleteModal(u)}
							title="Delete user"
						>
							🗑
						</button>
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>

	<!-- Create new user -->
	<div class="mt-3 p-3 border rounded">
    	<h5>Create New User</h5>
    	<form
        	id="create-user"
        	method="POST"
        	action="?/createUser"
        	use:enhance={async ({ result }) => {
            	if (!result) return;
            	if (result.type === 'success') {
                	pageError = '';
                	await invalidateAll();
            	}
            	if (result.type === 'failure') {
                	pageError = result.data?.errors?.general || result.data?.message || 'Create failed';
            	}
        	}}
    	>
        	<div class="row g-2">
            	<div class="col">
                	<input class="form-control" name="name" placeholder="Name" required />
            	</div>
            	<div class="col">
                	<input class="form-control" name="dob" type="date" />
            	</div>
            	<div class="col">
                	<input class="form-control" name="email" type="email" placeholder="Email" required />
            	</div>
            	<div class="col">
                	<select class="form-select" name="role">
                    	<option value="user">user</option>
                    	<option value="admin">admin</option>
                	</select>
            	</div>
            	<div class="col">
                	<input class="form-control" name="password" type="password" placeholder="Password" required />
            	</div>
            	<div class="col-auto">
                	<button type="submit" class="btn btn-success">+</button>
            	</div>
        	</div>
    	</form>
	</div>

<!-- =========================
     DELETE MODAL
========================= -->
{#if showDeleteModal}
	<div
		class="modal d-block"
		tabindex="-1"
		style="background: rgba(0,0,0,0.5); z-index: 1050;"
		role="dialog"
		aria-modal="true"
	>
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header bg-danger text-white">
					<h5 class="modal-title">Confirm Delete</h5>
					<button type="button" class="btn-close" aria-label="Close" onclick={closeDeleteModal}></button>
				</div>

				<div class="modal-body">
					<p>
						Are you sure you want to delete
						<strong>{userToDelete?.name}</strong>?
					</p>

					{#if modalDeleteError}
						<div class="alert alert-danger mt-3">{modalDeleteError}</div>
					{/if}
				</div>

				<div class="modal-footer">
					<form method="POST" action="?/deleteUser" use:enhance={enhanceDeleteModal} class="d-inline">
						<input type="hidden" name="id" value={userToDelete?.id} />
						<button type="submit" class="btn btn-danger">Yes, Delete</button>
					</form>

					<button type="button" class="btn btn-secondary" onclick={closeDeleteModal}>Cancel</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- =========================
     RESET PASSWORD MODAL
========================= -->
{#if showResetModal}
	<div
		class="modal d-block"
		tabindex="-1"
		style="background: rgba(0,0,0,0.5); z-index: 1050;"
		role="dialog"
		aria-modal="true"
	>
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header bg-warning">
					<h5 class="modal-title">Reset Password</h5>
					<button type="button" class="btn-close" aria-label="Close" onclick={closeResetModal}></button>
				</div>

				<div class="modal-body">
					<p>
						Set a new password for <strong>{userToReset?.name}</strong>
					</p>

					{#if modalResetError}
						<div class="alert alert-danger mt-3">{modalResetError}</div>
					{/if}

					{#if modalResetSuccess}
						<div class="alert alert-success mt-3">{modalResetSuccess}</div>
					{/if}
				</div>

				<div class="modal-footer">
					<form method="POST" action="?/resetPassword" use:enhance={() => enhanceResetModal()} class="d-inline">
						<input type="hidden" name="id" value={userToReset?.id} />
						<input class="form-control" name="password" type="password" placeholder="new password" required />
						<button type="submit" class="btn btn-warning ms-2">Reset</button>
					</form>

					<button type="button" class="btn btn-secondary" onclick={closeResetModal}>Cancel</button>
				</div>
			</div>
		</div>
	</div>
{/if}