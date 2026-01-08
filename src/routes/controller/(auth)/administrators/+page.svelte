<script lang="ts">
    import Button from '$lib/components/common/Button.svelte';
    import DataTable from '$lib/components/common/DataTable.svelte';

    let { data } = $props();
</script>

<svelte:head>
    <title>管理者管理 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>管理者</h1>
        <Button href="/controller/administrators/new" variant="outline">新規登録</Button>
    </div>

    <DataTable headers={['ログインID', '作成日', '操作']} isEmpty={data.administrators.length === 0}>
        {#each data.administrators as admin}
            <tr>
                <td>{admin.loginId}</td>
                <td>{new Date(admin.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                <td>
                    <div class="actions">
                        <Button href="/controller/administrators/{admin._id}/edit" variant="outline">編集</Button>
                        <form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('本当に削除しますか？')) e.preventDefault(); }}>
                            <input type="hidden" name="adminId" value={admin._id} />
                            <Button type="submit" variant="danger-outline">削除</Button>
                        </form>
                    </div>
                </td>
            </tr>
        {/each}
    </DataTable>
</div>
