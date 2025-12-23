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
						<button type="submit">ログアウト</button>
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

	button {
		background: none;
		border: none;
		color: #007bff;
		cursor: pointer;
		padding: 0;
		font: inherit;
		text-decoration: underline;
	}
</style>
