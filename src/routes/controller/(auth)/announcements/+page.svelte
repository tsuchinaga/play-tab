<script lang="ts">
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import DataTable from '$lib/components/common/DataTable.svelte';

    let { data } = $props();
</script>

<svelte:head>
    <title>お知らせ管理 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>お知らせ</h1>
        <Button href="/controller/announcements/new" variant="outline">新規登録</Button>
    </div>

    <div class="search-form-container">
        <form method="GET" class="search-form">
            <FormGroup label="タイトル" id="title" row>
                <input type="text" id="title" name="title" value={data.searchParams.title ?? ''} />
            </FormGroup>
            <div class="form-actions">
                <Button type="submit" variant="search">検索</Button>
                <Button href="/controller/announcements" variant="clear">クリア</Button>
            </div>
        </form>
    </div>

    <DataTable headers={['タイトル', '作成日', '操作']} isEmpty={data.announcements.length === 0} emptyMessage="お知らせがありません">
        {#each data.announcements as announcement}
            <tr>
                <td>{announcement.title}</td>
                <td>{new Date(announcement.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td>
                    <div class="actions">
                        <Button href="/controller/announcements/{announcement._id}/edit" variant="outline">編集</Button>
                        <form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('本当に削除しますか？')) e.preventDefault(); }}>
                            <input type="hidden" name="id" value={announcement._id} />
                            <Button type="submit" variant="danger-outline">削除</Button>
                        </form>
                    </div>
                </td>
            </tr>
        {/each}
    </DataTable>
</div>
