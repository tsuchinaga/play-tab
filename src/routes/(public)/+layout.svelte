<script lang="ts">
	let { data, children } = $props();
</script>

<div class="app">
	<header>
		<div class="header-content">
			<div class="header-left">
				<div class="site-name">
					<a href="/">Play Tab</a>
				</div>
				<nav>
					<a href="/search">検索</a>
				</nav>
			</div>
			<div class="header-right">
				<nav>
					{#if data.user}
						<a href="/tabs">TAB譜</a>
						<a href="/favorites">お気に入り</a>
						<a href="/user">{data.user.username}</a>
						<form method="POST" action="/logout">
							<button type="submit" class="link-button">ログアウト</button>
						</form>
					{:else}
						<a href="/login">ログイン</a>
						<a href="/register">登録</a>
					{/if}
				</nav>
			</div>
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

	.header-left, .header-right {
		display: flex;
		align-items: center;
		gap: 2rem;
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

	nav a {
		text-decoration: none;
		color: #007bff;
	}

	nav a:hover {
		text-decoration: underline;
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

	/* 検索フォーム */
	:global(.search-form-container) {
		background-color: #fff;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	:global(.search-form) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
	}

	:global(.search-form .form-actions) {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-top: 1rem;
	}

	:global(.btn-search) {
		width: 100px;
		height: 38px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		box-sizing: border-box;
	}

	:global(.btn-search:hover) {
		background-color: #0069d9;
	}

	:global(.btn-clear) {
		width: 100px;
		height: 38px;
		background-color: #6c757d;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		text-decoration: none;
		box-sizing: border-box;
	}

	:global(.btn-clear:hover) {
		background-color: #5a6268;
	}

	:global(.btn-primary.form-submit) {
		width: 140px;
		padding: 10px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-weight: bold;
		cursor: pointer;
		text-align: center;
		transition: background-color 0.2s;
	}

	:global(.btn-primary.form-submit:hover) {
		background-color: #0069d9;
	}

	:global(.btn-secondary) {
		display: inline-block;
		width: 140px;
		padding: 10px;
		background-color: #6c757d;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: bold;
		text-decoration: none;
		cursor: pointer;
		text-align: center;
		transition: background-color 0.2s;
	}

	:global(.btn-secondary:hover) {
		background-color: #5a6268;
	}

	:global(.form-group.row) {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
		gap: 20px;
	}

	:global(.form-group.row label) {
		width: 120px;
		font-weight: bold;
		color: #495057;
		margin-bottom: 0;
		display: block;
	}

	:global(.input-container) {
		flex: 1;
	}

	:global(.input-container input),
	:global(.input-container select),
	:global(.input-container textarea) {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #dee2e6;
		border-radius: 4px;
		box-sizing: border-box;
		font-family: inherit;
		font-size: 1rem;
	}

	:global(.form-card) {
		background: #fff;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border: 1px solid #dee2e6;
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	/* 一覧画面（テーブル）共通スタイル */
	:global(.list-container) {
		max-width: 1000px;
		margin: 0 auto;
	}

	:global(.list-header) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	:global(.list-header h1) {
		margin: 0;
		font-size: 1.75rem;
		color: #333;
	}

	:global(.table-wrapper) {
		background: white;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	:global(.list-table) {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}

	:global(.list-table th),
	:global(.list-table td) {
		padding: 1rem;
		border-bottom: 1px solid #dee2e6;
	}

	:global(.list-table th) {
		background-color: #f8f9fa;
		font-weight: bold;
		color: #495057;
	}

	:global(.list-table th.sortable) {
		cursor: pointer;
		user-select: none;
		white-space: nowrap;
	}

	:global(.list-table th.sortable:hover) {
		background-color: #e9ecef;
	}

	:global(.list-table tr:last-child td) {
		border-bottom: none;
	}

	/* ステータスバッジ */
	:global(.status-badge) {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.85rem;
		font-weight: 500;
	}

	:global(.status-public) {
		background-color: #e7f3ff;
		color: #007bff;
	}

	:global(.status-private) {
		background-color: #f8d7da;
		color: #dc3545;
	}

	:global(.status-limited) {
		background-color: #fff3cd;
		color: #856404;
	}

	/* 操作ボタン */
	:global(.actions) {
		display: flex;
		gap: 0.5rem;
	}

	:global(.btn-outline) {
		display: inline-block;
		padding: 0.4rem 0.8rem;
		border: 1px solid #007bff;
		color: #007bff;
		background: none;
		border-radius: 4px;
		text-decoration: none;
		font-size: 0.9rem;
		transition: all 0.2s;
		cursor: pointer;
	}

	:global(.btn-outline:hover) {
		background-color: #007bff;
		color: white;
	}

	:global(.btn-danger-outline) {
		display: inline-block;
		padding: 0.4rem 0.8rem;
		border: 1px solid #dc3545;
		color: #dc3545;
		background: none;
		border-radius: 4px;
		text-decoration: none;
		font-size: 0.9rem;
		transition: all 0.2s;
		cursor: pointer;
	}

	:global(.btn-danger-outline:hover) {
		background-color: #dc3545;
		color: white;
	}
</style>
