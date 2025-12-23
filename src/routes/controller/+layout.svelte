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
						<button type="submit">ログアウト</button>
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

	button {
		background: none;
		border: none;
		color: #adb5bd;
		cursor: pointer;
		padding: 0;
		font: inherit;
		text-decoration: underline;
	}

	button:hover {
		color: white;
	}
</style>
