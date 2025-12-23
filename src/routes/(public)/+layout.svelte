<script lang="ts">
	let { data, children } = $props();
</script>

<div class="app">
	<header>
		<div class="header-content">
			<div class="site-name">
				<a href="/">Play Tab</a>
			</div>
			<nav>
				{#if data.user}
					<span>{data.user.username}</span>
					<form method="POST" action="/logout">
						<button type="submit" class="link-button">ログアウト</button>
					</form>
				{:else}
					<a href="/login">ログイン</a>
					<a href="/register">登録</a>
				{/if}
			</nav>
		</div>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>&copy; tsuchinaga.com</p>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		background-color: #f8f9fa;
		border-bottom: 1px solid #dee2e6;
		padding: 1rem;
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
		color: #333;
	}

	nav {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	main {
		flex: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1rem;
		width: 100%;
	}

	footer {
		background-color: #f8f9fa;
		border-top: 1px solid #dee2e6;
		padding: 1rem;
		text-align: center;
	}

	footer p {
		margin: 0;
		color: #6c757d;
	}

	button.link-button {
		background: none;
		border: none;
		color: #007bff;
		cursor: pointer;
		padding: 0;
		font: inherit;
		text-decoration: underline;
	}

	:global(.form-container) {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		background-color: #fff;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	:global(.form-container h1) {
		margin-top: 0;
		margin-bottom: 1.5rem;
		text-align: center;
		color: #333;
	}

	:global(.form-group) {
		margin-bottom: 1rem;
	}

	:global(.form-group label) {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
		color: #495057;
	}

	:global(.form-group input) {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ced4da;
		border-radius: 4px;
		box-sizing: border-box;
	}

	:global(.form-group input:focus) {
		outline: none;
		border-color: #80bdff;
		box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
	}

	:global(.btn-primary) {
		display: block;
		width: 100%;
		padding: 0.75rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	:global(.btn-primary:hover) {
		background-color: #0069d9;
	}

	:global(.error-message) {
		color: #dc3545;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	:global(.form-footer) {
		margin-top: 1.5rem;
		text-align: center;
		font-size: 0.9rem;
	}

	:global(.form-footer a) {
		color: #007bff;
		text-decoration: none;
	}

	:global(.form-footer a:hover) {
		text-decoration: underline;
	}
</style>
