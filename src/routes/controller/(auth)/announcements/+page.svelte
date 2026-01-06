<script lang="ts">
    let { data } = $props();
</script>

<svelte:head>
    <title>お知らせ管理 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>お知らせ</h1>
        <a href="/controller/announcements/new" class="btn-admin-outline">新規登録</a>
    </div>

    <div class="search-form-container">
        <form method="GET" class="search-form">
            <div class="form-group row">
                <label for="title">タイトル</label>
                <div class="input-container">
                    <input type="text" id="title" name="title" value={data.searchParams.title ?? ''} />
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-search">検索</button>
                <a href="/controller/announcements" class="btn-clear">クリア</a>
            </div>
        </form>
    </div>

    <div class="table-wrapper">
        <table class="list-table">
            <thead>
                <tr>
                    <th>タイトル</th>
                    <th>作成日</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {#each data.announcements as announcement}
                    <tr>
                        <td>{announcement.title}</td>
                        <td>{new Date(announcement.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                        <td>
                            <div class="actions">
                                <a href="/controller/announcements/{announcement._id}/edit" class="btn-admin-outline">編集</a>
                                <form method="POST" action="?/delete" onsubmit={(e) => { if (!confirm('本当に削除しますか？')) e.preventDefault(); }}>
                                    <input type="hidden" name="id" value={announcement._id} />
                                    <button type="submit" class="btn-admin-danger-outline">削除</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                {:else}
                    <tr>
                        <td colspan="3" style="text-align: center;">お知らせがありません</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
</style>
