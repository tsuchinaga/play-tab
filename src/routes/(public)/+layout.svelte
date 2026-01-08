<script lang="ts">
	let { data, children } = $props();
	let isMenuOpen = $state(false);
	let showScrollTop = $state(false);

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function closeMenu() {
		isMenuOpen = false;
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleScroll() {
		showScrollTop = window.scrollY > 100;
	}
</script>

<svelte:window onscroll={handleScroll} />

<div class="app">
	<header>
		<div class="header-content">
			<div class="header-left">
				<div class="site-name">
					<a href="/" onclick={closeMenu}>
						<img src="/img/logo.png" alt="Logo" class="logo" />
						Play Tab
					</a>
				</div>
			</div>

			<button class="burger-menu" onclick={toggleMenu} aria-label="メニュー開閉">
				<span class="burger-bar" class:open={isMenuOpen}></span>
				<span class="burger-bar" class:open={isMenuOpen}></span>
				<span class="burger-bar" class:open={isMenuOpen}></span>
			</button>

			<div class="header-nav-container" class:open={isMenuOpen}>
				<div class="header-left-nav">
					<nav>
						<a href="/search" onclick={closeMenu}>検索</a>
						<a href="/usage" onclick={closeMenu}>使い方</a>
					</nav>
				</div>
				<div class="header-right-nav">
					<nav>
						{#if data.user}
							<a href="/home" onclick={closeMenu}>ホーム</a>
							<a href="/tabs" onclick={closeMenu}>TAB譜</a>
							<a href="/favorites" onclick={closeMenu}>お気に入り</a>
							<a href="/user" onclick={closeMenu}>{data.user.username}</a>
							<form method="POST" action="/logout">
								<button type="submit" class="link-button">ログアウト</button>
							</form>
						{:else}
							<a href="/login" onclick={closeMenu}>ログイン</a>
							<a href="/register" onclick={closeMenu}>登録</a>
						{/if}
					</nav>
				</div>
			</div>

			{#if isMenuOpen}
				<button class="overlay" onclick={closeMenu} aria-label="メニューを閉じる"></button>
			{/if}
		</div>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<p>&copy; {data.PUBLIC_COPYRIGHT_HOLDER || 'Play Tab'}</p>
	</footer>

	{#if showScrollTop}
		<button class="scroll-top" onclick={scrollToTop} aria-label="トップに戻る">
			<span class="arrow-up"></span>
		</button>
	{/if}
</div>

<style>
	* {
		box-sizing: border-box;
	}

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		overflow-x: hidden;
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
		position: relative;
	}

	.header-left {
		display: flex;
		align-items: center;
	}

	.header-nav-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex: 1;
		margin-left: 2rem;
	}

	.header-left-nav, .header-right-nav {
		display: flex;
		align-items: center;
	}

	.site-name a {
		font-size: 1.5rem;
		font-weight: bold;
		text-decoration: none;
		color: #333;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		white-space: nowrap;
	}

	.logo {
		height: 40px;
		width: auto;
	}

	nav {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	/* バーガーメニュー */
	.burger-menu {
		display: none;
		flex-direction: column;
		justify-content: space-around;
		width: 30px;
		height: 24px;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		z-index: 1001;
	}

	.burger-bar {
		width: 30px;
		height: 3px;
		background-color: #333;
		border-radius: 10px;
		transition: all 0.3s linear;
		position: relative;
		transform-origin: 1px;
	}

	.burger-bar.open:nth-child(1) {
		transform: rotate(45deg);
	}

	.burger-bar.open:nth-child(2) {
		opacity: 0;
	}

	.burger-bar.open:nth-child(3) {
		transform: rotate(-45deg);
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.scroll-top {
		position: fixed;
		right: 20px;
		bottom: 20px;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: #007bff;
		border: none;
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition:
			background-color 0.2s,
			transform 0.2s;
		z-index: 1000;
	}

	.scroll-top:hover {
		background-color: #0056b3;
		transform: translateY(-2px);
	}

	.arrow-up {
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-bottom: 12px solid white;
		margin-bottom: 2px;
	}

	@media (max-width: 768px) {
		.burger-menu {
			display: flex;
		}

		.header-nav-container {
			position: fixed;
			top: 0;
			right: -100%;
			width: 250px;
			height: 100vh;
			background-color: #f8f9fa;
			flex-direction: column;
			justify-content: flex-start;
			align-items: flex-start;
			padding: 80px 20px 20px;
			transition: right 0.3s ease-in-out;
			z-index: 1000;
			margin-left: 0;
			box-shadow: -2px 0 5px rgba(0,0,0,0.1);
		}

		.header-nav-container.open {
			right: 0;
		}

		.header-left-nav, .header-right-nav {
			width: 100%;
			flex-direction: column;
			align-items: flex-start;
		}

		nav {
			flex-direction: column;
			align-items: flex-start;
			width: 100%;
			gap: 1.5rem;
			margin-bottom: 1.5rem;
		}

		nav a, .link-button {
			font-size: 1.1rem;
		}

		:global(.form-group.row) {
			flex-direction: column;
			align-items: stretch;
			gap: 8px;
		}

		:global(.form-group.row label) {
			width: 100%;
		}

		:global(.list-header) {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		:global(.list-header h1) {
			font-size: 1.5rem;
		}

		:global(.list-header .btn-primary),
		:global(.list-header .btn-secondary),
		:global(.list-header .btn-outline),
		:global(.list-header .btn-danger-outline) {
			width: 100% !important;
		}

		:global(.table-wrapper) {
			width: 100%;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
		}

		:global(.list-table) {
			width: auto;
			min-width: 600px;
			display: table;
		}

		:global(.actions) {
			display: flex;
			gap: 0.5rem;
			flex-wrap: wrap;
		}

		:global(.actions .btn-outline),
		:global(.actions .btn-danger-outline),
		:global(.actions form) {
			width: auto !important;
			flex: 1;
			min-width: 70px;
		}

		:global(.actions button) {
			width: 100% !important;
		}
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

	:global(.form-card) {
		background-color: #fff;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		padding: 20px;
		margin-bottom: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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

	:global(.form-group.row) {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	:global(.form-group label) {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: bold;
		color: #495057;
	}

	:global(.form-group.row label) {
		width: 120px;
		flex-shrink: 0;
		margin-bottom: 0;
	}

	:global(.input-container) {
		flex: 1;
	}

	:global(.form-group input),
	:global(.form-group textarea),
	:global(.form-group select) {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ced4da;
		border-radius: 4px;
		box-sizing: border-box;
		font-size: 1rem;
	}

	:global(.form-group input:focus),
	:global(.form-group textarea:focus),
	:global(.form-group select:focus) {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
	}

	:global(.btn-primary) {
		display: inline-block;
		width: 140px;
		padding: 0.75rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
		text-align: center;
		text-decoration: none;
	}

	:global(.btn-primary:hover) {
		background-color: #0069d9;
	}

	:global(.btn-secondary) {
		display: inline-block;
		width: 140px;
		padding: 0.75rem;
		background-color: #6c757d;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s;
		text-align: center;
		text-decoration: none;
	}

	:global(.btn-secondary:hover) {
		background-color: #5a6268;
	}

	:global(.form-actions) {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1.5rem;
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
		text-decoration: none;
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

	:global(.list-header .btn-primary),
	:global(.list-header .btn-secondary),
	:global(.list-header .btn-outline),
	:global(.list-header .btn-danger-outline) {
		width: 140px;
		font-size: 1rem;
		padding: 0.75rem;
	}

	:global(.table-wrapper) {
		width: 100%;
		background: white;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		overflow-x: auto;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		-webkit-overflow-scrolling: touch;
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
		white-space: nowrap;
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

	:global(.empty-message) {
		text-align: left;
		padding: 2rem;
		color: #6c757d;
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

	:global(.status-draft) {
		background-color: #e9ecef;
		color: #6c757d;
	}

	:global(.status-limited) {
		background-color: #fff3cd;
		color: #856404;
	}

	:global(.status-instrument) {
		background-color: #e7f3ff;
		color: #007bff;
		border: 1px solid #b3d7ff;
	}

	:global(.instruments-badges) {
		display: flex;
		gap: 5px;
		flex-wrap: wrap;
	}

	/* 操作ボタン */
	:global(.actions) {
		display: flex;
		gap: 0.5rem;
	}

	:global(.btn-outline),
	:global(.btn-danger-outline) {
		display: inline-block;
		padding: 0.4rem 0.8rem;
		border-radius: 4px;
		text-decoration: none;
		font-size: 0.9rem;
		transition: all 0.2s;
		cursor: pointer;
		width: 80px;
		text-align: center;
		box-sizing: border-box;
	}

	:global(.btn-outline) {
		border: 1px solid #007bff;
		color: #007bff;
		background: none;
	}

	:global(.btn-outline:hover) {
		background-color: #007bff;
		color: white;
	}

	:global(.btn-danger-outline) {
		border: 1px solid #dc3545;
		color: #dc3545;
		background: none;
	}

	:global(.btn-danger-outline:hover) {
		background-color: #dc3545;
		color: white;
	}
	:global(.empty-message) {
		text-align: left;
		padding: 2rem;
		color: #6c757d;
	}
</style>
