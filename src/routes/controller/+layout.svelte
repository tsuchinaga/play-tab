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
			<div class="site-name">
				<a href="/controller/users" onclick={closeMenu}>Play Tab Admin</a>
			</div>

			<button class="burger-menu" onclick={toggleMenu} aria-label="メニュー開閉">
				<span class="burger-bar" class:open={isMenuOpen}></span>
				<span class="burger-bar" class:open={isMenuOpen}></span>
				<span class="burger-bar" class:open={isMenuOpen}></span>
			</button>

			<div class="header-nav-container" class:open={isMenuOpen}>
				<nav>
					{#if data.admin}
						<a href="/controller/users" onclick={closeMenu}>ユーザー</a>
						<a href="/controller/tabs" onclick={closeMenu}>TAB譜</a>
						<a href="/controller/announcements" onclick={closeMenu}>お知らせ</a>
						<a href="/controller/administrators" onclick={closeMenu}>管理者</a>
						<span class="admin-id">{data.admin.loginId}</span>
						<form method="POST" action="/controller/logout">
							<button type="submit" class="link-button">ログアウト</button>
						</form>
					{:else}
						<a href="/controller/login" onclick={closeMenu}>ログイン</a>
					{/if}
				</nav>
			</div>

			{#if isMenuOpen}
				<button class="overlay" onclick={closeMenu} aria-label="メニューを閉じる"></button>
			{/if}
		</div>
	</header>

	<main>
		{@render children()}
	</main>

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
		position: relative;
	}

	.header-nav-container {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		flex: 1;
		margin-left: 2rem;
	}

	.site-name a {
		font-size: 1.5rem;
		font-weight: bold;
		text-decoration: none;
		color: white;
		white-space: nowrap;
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
		background-color: white;
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
			background-color: #343a40;
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

		nav {
			flex-direction: column;
			align-items: flex-start;
			width: 100%;
			gap: 1.5rem;
			margin-bottom: 1.5rem;
		}

		nav a, .link-button, .admin-id {
			font-size: 1.1rem;
		}

		.admin-id {
			color: #adb5bd;
		}
	}

	nav a {
		color: white;
		text-decoration: none;
	}

	nav a:hover {
		text-decoration: underline;
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

	:global(.form-container) {
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		border: 1px solid #495057;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	:global(.form-container h1) {
		margin-top: 0;
		margin-bottom: 1.5rem;
		text-align: center;
		font-size: 1.5rem;
		color: #343a40;
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
		border-color: #343a40;
		box-shadow: 0 0 0 0.2rem rgba(52, 58, 64, 0.25);
	}

	:global(.btn-primary) {
		display: inline-block;
		width: 140px;
		padding: 0.75rem;
		background-color: #343a40;
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
		background-color: #23272b;
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

	:global(.error-message) {
		color: #dc3545;
		margin-bottom: 1rem;
		font-weight: bold;
	}

	/* 一覧表示 */
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
		color: #343a40;
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

	:global(.btn-outline) {
		display: inline-block;
		padding: 0.4rem 0.8rem;
		border: 1px solid #343a40;
		color: #343a40;
		background: none;
		border-radius: 4px;
		text-decoration: none;
		font-size: 0.9rem;
		transition: all 0.2s;
		cursor: pointer;
		width: 80px;
		text-align: center;
		box-sizing: border-box;
	}

	:global(.btn-outline:hover) {
		background-color: #343a40;
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
		width: 80px;
		text-align: center;
		box-sizing: border-box;
	}

	:global(.btn-danger-outline:hover) {
		background-color: #dc3545;
		color: white;
	}

	:global(.visibility-badge) {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.85rem;
		font-weight: 500;
	}

	:global(.status-public) {
		background-color: #e7f3ff;
		color: #343a40;
	}

	:global(.status-private) {
		background-color: #f8d7da;
		color: #dc3545;
	}

	:global(.status-draft) {
		background-color: #e9ecef;
		color: #6c757d;
	}

	:global(.status-unlisted) {
		background-color: #fff3cd;
		color: #856404;
	}

	:global(.status-limited) {
		background-color: #fff3cd;
		color: #856404;
	}

	@media (max-width: 768px) {
		:global(.list-table) {
			width: auto;
			min-width: 600px;
			display: table;
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

		:global(.list-header .btn-primary),
		:global(.list-header .btn-secondary),
		:global(.list-header .btn-outline),
		:global(.list-header .btn-danger-outline) {
			width: 100% !important;
		}
	}

	:global(.empty-message) {
		text-align: left;
		padding: 2rem;
		color: #6c757d;
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
		background-color: #343a40;
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
		background-color: #23272b;
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

	:global(.form-actions) {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1.5rem;
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

	:global(.actions) {
		display: flex;
		gap: 0.5rem;
	}

	:global(.empty-message) {
		text-align: left;
		padding: 2rem;
		color: #6c757d;
	}
</style>
