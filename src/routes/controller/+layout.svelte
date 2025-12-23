<script lang="ts">
	let { data, children } = $props();
</script>

<div class="app">
	<header>
		<div class="header-content">
			<div class="site-name">
				<a href="/controller/home">Play Tab Admin</a>
			</div>
			<nav>
				{#if data.admin}
					<span>{data.admin.loginId}</span>
					<form method="POST" action="/controller/logout">
						<button type="submit" class="link-button">ログアウト</button>
					</form>
				{:else}
					<a href="/controller/login">ログイン</a>
				{/if}
			</nav>
		</div>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		background-color: #343a40;
		border-bottom: 1px solid #dee2e6;
		padding: 1rem;
		color: white;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	.site-name a {
		font-size: 1.5rem;
		font-weight: bold;
		text-decoration: none;
		color: white;
	}

	nav {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	nav a {
		color: white;
		text-decoration: none;
	}

	main {
		flex: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		width: 100%;
	}

	button.link-button {
		background: none;
		border: none;
		color: #adb5bd;
		cursor: pointer;
		padding: 0;
		font: inherit;
		text-decoration: underline;
	}

	button.link-button:hover {
		color: white;
	}

	:global(.admin-form-container) {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		border: 1px solid #495057;
		border-radius: 4px;
		background-color: #fff;
	}

	:global(.admin-form-container h1) {
		margin-top: 0;
		margin-bottom: 1.5rem;
		text-align: center;
		font-size: 1.25rem;
		color: #343a40;
	}

	:global(.admin-form-group) {
		margin-bottom: 1rem;
	}

	:global(.admin-form-group label) {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.9rem;
		color: #495057;
	}

	:global(.admin-form-group input) {
		width: 100%;
		padding: 0.4rem;
		border: 1px solid #ced4da;
		border-radius: 2px;
		box-sizing: border-box;
	}

	:global(.btn-admin) {
		display: block;
		width: 100%;
		padding: 0.5rem;
		background-color: #343a40;
		color: white;
		border: none;
		border-radius: 2px;
		cursor: pointer;
	}

	:global(.btn-admin:hover) {
		background-color: #23272b;
	}

	:global(.admin-error-message) {
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		padding: 0.5rem;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}
</style>
