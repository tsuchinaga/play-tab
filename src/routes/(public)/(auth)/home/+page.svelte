<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>ホーム | Play Tab</title>
</svelte:head>

<div class="list-container">
	<div class="list-header">
		<h1>ホーム</h1>
	</div>

	<div class="home-content">
		<section class="announcement-section">
			<h2>お知らせ</h2>
			<div class="form-card">
				{#if data.announcements && data.announcements.length > 0}
					<ul class="announcement-list">
						{#each data.announcements as announcement}
							<li>
								<span class="date">{new Date(announcement.createdAt).toLocaleDateString()}</span>
								<a href="/announcements/{announcement._id}" class="title">{announcement.title}</a>
							</li>
						{/each}
					</ul>
					<div class="more-link">
						<a href="/announcements">過去のお知らせをみる</a>
					</div>
				{:else}
					<p class="no-data">現在お知らせはありません。</p>
				{/if}
			</div>
		</section>

		<section class="menu-section">
			<h2>メニュー</h2>
			<div class="menu-grid">
				<a href="/tabs" class="menu-item form-card">
					<span class="menu-icon">🎸</span>
					<span class="menu-label">TAB譜管理</span>
				</a>
				<a href="/favorites" class="menu-item form-card">
					<span class="menu-icon">⭐</span>
					<span class="menu-label">お気に入り管理</span>
				</a>
				<a href="/user" class="menu-item form-card">
					<span class="menu-icon">👤</span>
					<span class="menu-label">ユーザー設定</span>
				</a>
			</div>
		</section>
	</div>
</div>

<style>
	.home-content {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.welcome-message {
		font-size: 1.1rem;
		margin-bottom: 0;
	}

	h2 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
		color: #333;
		border-left: 4px solid #007bff;
		padding-left: 0.75rem;
	}

	.announcement-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.announcement-list li {
		padding: 0.75rem 0;
		border-bottom: 1px solid #dee2e6;
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.announcement-list li:last-child {
		border-bottom: none;
	}

	.announcement-list .date {
		color: #6c757d;
		min-width: 100px;
		font-size: 0.9rem;
	}

	.announcement-list .title {
		flex: 1;
		font-weight: 500;
		color: inherit;
		text-decoration: none;
	}

	.announcement-list .title:hover {
		text-decoration: underline;
		color: #007bff;
	}

	.more-link {
		margin-top: 1rem;
		text-align: right;
	}

	.more-link a {
		color: #007bff;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.more-link a:hover {
		text-decoration: underline;
	}

	.no-data {
		color: #6c757d;
		margin: 0;
	}

	.menu-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.menu-item {
		text-decoration: none;
		color: inherit;
		display: flex;
		align-items: center;
		flex-direction: row;
		gap: 1.5rem;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.menu-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		border-color: #007bff;
	}

	.menu-icon {
		font-size: 2rem;
	}

	.menu-label {
		font-size: 1.1rem;
		font-weight: bold;
	}
</style>
