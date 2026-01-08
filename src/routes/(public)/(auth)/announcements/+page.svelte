<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>お知らせ一覧 | Play Tab</title>
</svelte:head>

<div class="list-container">
	<div class="list-header">
		<h1>お知らせ一覧</h1>
	</div>

	<div class="table-wrapper">
		<table class="list-table">
			<thead>
				<tr>
					<th style="width: 150px;">日付</th>
					<th>タイトル</th>
				</tr>
			</thead>
			<tbody>
				{#if data.announcements && data.announcements.length > 0}
					{#each data.announcements as announcement}
						<tr>
							<td>{new Date(announcement.createdAt).toLocaleDateString()}</td>
							<td>
								<a href="/announcements/{announcement._id}">{announcement.title}</a>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="2" class="empty-message">お知らせはありません。</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	<div class="form-actions" style="margin-top: 2rem;">
		<a href="/home" class="btn-secondary">ホームへ戻る</a>
	</div>
</div>

<style>
	.list-table a {
		color: #007bff;
		text-decoration: none;
	}

	.list-table a:hover {
		text-decoration: underline;
	}
</style>
