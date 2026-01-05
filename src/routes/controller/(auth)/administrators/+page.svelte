<script lang="ts">
    let { data } = $props();
</script>

<svelte:head>
    <title>管理者管理 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>管理者</h1>
        <a href="/controller/administrators/new" class="btn-admin-outline">新規登録</a>
    </div>

    <div class="table-wrapper">
        <table class="list-table">
            <thead>
                <tr>
                    <th>ログインID</th>
                    <th>作成日</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {#each data.administrators as admin}
                    <tr>
                        <td>{admin.loginId}</td>
                        <td>{new Date(admin.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                        <td>
                            <div class="actions">
                                <a href="/controller/administrators/{admin._id}/edit" class="btn-admin-outline">編集</a>
                                <form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('本当に削除しますか？')) e.preventDefault(); }}>
                                    <input type="hidden" name="adminId" value={admin._id} />
                                    <button type="submit" class="btn-admin-danger-outline">削除</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
