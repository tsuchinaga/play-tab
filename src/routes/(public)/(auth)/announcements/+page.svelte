<script lang="ts">
	import Button from '$lib/components/common/Button.svelte';
	import DataTable from '$lib/components/common/DataTable.svelte';
	let { data } = $props();
</script>

{#snippet header_date()}
	<th style="width: 150px;">日付</th>
{/snippet}

<svelte:head>
	<title>お知らせ一覧 | Play Tab</title>
</svelte:head>

<div class="list-container">
	<div class="list-header">
		<h1>お知らせ一覧</h1>
	</div>

	<DataTable headers={[header_date, 'タイトル']} isEmpty={!data.announcements || data.announcements.length === 0} emptyMessage="お知らせはありません。">
		{#each data.announcements as announcement}
			<tr>
				<td>{new Date(announcement.createdAt).toLocaleDateString()}</td>
				<td>
					<a href="/announcements/{announcement._id}">{announcement.title}</a>
				</td>
			</tr>
		{/each}
	</DataTable>

	<div class="form-actions" style="margin-top: 2rem;">
		<Button href="/home" variant="secondary">ホームへ戻る</Button>
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
