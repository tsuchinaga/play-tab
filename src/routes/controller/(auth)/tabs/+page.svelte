<script lang="ts">
    let { data } = $props();
</script>

<svelte:head>
    <title>TAB譜管理 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>TAB譜</h1>
    </div>

    <div class="search-form-container">
        <form method="GET" class="search-form">
            <div class="form-group row">
                <label for="name">TAB譜名</label>
                <div class="input-container">
                    <input type="text" id="name" name="name" value={data.searchParams.name} />
                </div>
            </div>
            <div class="form-group row">
                <label for="username">ユーザー名</label>
                <div class="input-container">
                    <input type="text" id="username" name="username" value={data.searchParams.username} />
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-search">検索</button>
                <a href="/controller/tabs" class="btn-clear">クリア</a>
            </div>
        </form>
    </div>

    <div class="table-wrapper">
        <table class="list-table">
            <thead>
                <tr>
                    <th>TAB譜名</th>
                    <th>ユーザー名</th>
                    <th>公開設定</th>
                    <th>閲覧数</th>
                    <th>お気に入り数</th>
                    <th>更新日時</th>
                </tr>
            </thead>
            <tbody>
                {#each data.tabs as tab}
                    <tr>
                        <td>
                            <a href="/tab/{tab._id}" target="_blank">{tab.name}</a>
                        </td>
                        <td>
                            <a href="/controller/users/{tab.userId}">{tab.user.username}</a>
                        </td>
                        <td>
                            <span class="status-badge status-{tab.visibility}">
                                {tab.visibility === 'public' ? '公開' : tab.visibility === 'private' ? '非公開' : '限定公開'}
                            </span>
                        </td>
                        <td>{tab.viewCount ?? 0}</td>
                        <td>{tab.favoriteCount ?? 0}</td>
                        <td>{new Date(tab.updatedAt).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
