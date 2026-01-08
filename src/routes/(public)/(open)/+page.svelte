<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchName = $state('');

	function formatDate(date: string | Date) {
		if (!date) return '';
		const d = new Date(date);
		return d.toLocaleDateString('ja-JP', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Play Tab - TAB譜共有・再生サイト</title>
</svelte:head>

<div class="list-container">
	<section class="overview">
		<h1>Play Tabへようこそ</h1>
		<p>Play Tabは、ギターやベースなどのTAB譜を投稿、共有、そしてブラウザ上で直接再生して練習することができるサイトです。</p>
	</section>

	<div class="search-form-container">
		<form action="/search" method="get" class="search-form">
			<div class="form-group row">
				<label for="name">キーワード</label>
				<div class="input-container">
					<input
						type="text"
						id="name"
						name="name"
						bind:value={searchName}
						placeholder="TAB譜名で検索"
					/>
				</div>
			</div>
			<div class="form-group row">
				<label>楽器</label>
				<div class="checkbox-group">
					<label class="checkbox-label">
						<input type="checkbox" name="instruments" value="Guitar" />
						Guitar
					</label>
					<label class="checkbox-label">
						<input type="checkbox" name="instruments" value="Bass" />
						Bass
					</label>
				</div>
			</div>
			<div class="form-actions">
				<button type="submit" class="btn-search">検索</button>
			</div>
		</form>
	</div>

	<section>
		<div class="list-header">
			<h1>最近更新されたTAB譜</h1>
		</div>
		<div class="table-wrapper">
			<table class="list-table">
				<thead>
					<tr>
						<th>曲名</th>
						<th>投稿者</th>
						<th>楽器</th>
						<th>更新日</th>
					</tr>
				</thead>
				<tbody>
					{#each data.recentTabs as tab}
						<tr>
							<td><a href="/tab/{tab._id}">{tab.name}</a></td>
							<td><a href="/user/{tab.user._id}">{tab.user.username}</a></td>
							<td>{tab.instruments.join(', ')}</td>
							<td>{formatDate(tab.updatedAt)}</td>
						</tr>
					{/each}
					{#if data.recentTabs.length === 0}
						<tr>
							<td colspan="4" class="empty-message">TAB譜がありません。</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</section>

	<section style="margin-top: 40px;">
		<div class="list-header">
			<h1>お気に入り数が多いTAB譜</h1>
		</div>
		<div class="table-wrapper">
			<table class="list-table">
				<thead>
					<tr>
						<th>曲名</th>
						<th>投稿者</th>
						<th>楽器</th>
						<th>お気に入り</th>
					</tr>
				</thead>
				<tbody>
					{#each data.topFavoritedTabs as tab}
						<tr>
							<td><a href="/tab/{tab._id}">{tab.name}</a></td>
							<td><a href="/user/{tab.user._id}">{tab.user.username}</a></td>
							<td>{tab.instruments.join(', ')}</td>
							<td>{tab.favoriteCount}</td>
						</tr>
					{/each}
					{#if data.topFavoritedTabs.length === 0}
						<tr>
							<td colspan="4" class="empty-message">TAB譜がありません。</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</section>
</div>

<style>
	.overview {
		margin-bottom: 40px;
		text-align: center;
		padding: 40px 20px;
		background: #f8f9fa;
		border-radius: 8px;
	}
	.overview h1 {
		font-size: 2.5rem;
		margin-bottom: 20px;
		color: #333;
	}
	.overview p {
		font-size: 1.2rem;
		color: #6c757d;
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.overview {
			padding: 20px 10px;
			margin-bottom: 20px;
		}
		.overview h1 {
			font-size: 1.75rem;
			margin-bottom: 15px;
		}
		.overview p {
			font-size: 1rem;
		}
		.checkbox-group {
			flex-direction: column;
			gap: 10px;
		}
	}
	section {
		margin-bottom: 40px;
	}
	.checkbox-group {
		display: flex;
		gap: 20px;
	}
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		cursor: pointer;
		font-weight: normal;
	}
	.checkbox-label input {
		width: auto;
	}
</style>
