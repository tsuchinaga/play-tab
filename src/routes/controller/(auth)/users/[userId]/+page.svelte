<script lang="ts">
    let { data } = $props();
</script>

<svelte:head>
    <title>{data.targetUser.username} のプロフィール | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>{data.targetUser.username} のプロフィール</h1>
        <a href="/controller/users" class="btn-outline">一覧に戻る</a>
    </div>

    <div class="form-card" style="margin-bottom: 2rem;">
        <div class="form-group row">
            <label>ログインID</label>
            <div>{data.targetUser.loginId}</div>
        </div>
        <div class="form-group row">
            <label>ユーザー名</label>
            <div>{data.targetUser.username}</div>
        </div>
        <div class="form-group row">
            <label>メールアドレス</label>
            <div>{data.targetUser.email}</div>
        </div>
        <div class="form-group row">
            <label>登録日時</label>
            <div>{new Date(data.targetUser.createdAt).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
        </div>
    </div>

    <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: #343a40;">登録TAB譜一覧</h2>
    <div class="table-wrapper">
        <table class="list-table">
            <thead>
                <tr>
                    <th>TAB譜名</th>
                    <th>公開設定</th>
                    <th>更新日</th>
                </tr>
            </thead>
            <tbody>
                {#each data.tabs as tab}
                    <tr>
                        <td>
                            <a href="/tab/{tab._id}" target="_blank">{tab.name}</a>
                        </td>
                        <td>
                            <span class="status-badge status-{tab.visibility}">
                                {tab.visibility === 'public' ? '公開' : tab.visibility === 'private' ? '非公開' : '限定公開'}
                            </span>
                        </td>
                        <td>{new Date(tab.updatedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
