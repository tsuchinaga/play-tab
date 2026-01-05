<script lang="ts">
    let { data } = $props();
</script>

<svelte:head>
    <title>ユーザー管理 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>ユーザー</h1>
    </div>

    <div class="search-form-container">
        <form method="GET" class="search-form">
            <div class="form-group row">
                <label for="loginId">ログインID</label>
                <div class="input-container">
                    <input type="text" id="loginId" name="loginId" value={data.searchParams.loginId} />
                </div>
            </div>
            <div class="form-group row">
                <label for="username">ユーザー名</label>
                <div class="input-container">
                    <input type="text" id="username" name="username" value={data.searchParams.username} />
                </div>
            </div>
            <div class="form-group row">
                <label for="email">メールアドレス</label>
                <div class="input-container">
                    <input type="email" id="email" name="email" value={data.searchParams.email} />
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-search">検索</button>
                <a href="/controller/users" class="btn-clear">クリア</a>
            </div>
        </form>
    </div>

    <div class="table-wrapper">
        <table class="list-table">
            <thead>
                <tr>
                    <th>ログインID</th>
                    <th>ユーザー名</th>
                    <th>メールアドレス</th>
                    <th>状態</th>
                    <th>登録日時</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {#each data.users as user}
                    <tr>
                        <td>{user.loginId}</td>
                        <td>
                            <a href="/controller/users/{user._id}">{user.username}</a>
                        </td>
                        <td>{user.email}</td>
                        <td>
                            <span class="status-badge {user.isActive ? 'status-public' : 'status-private'}">
                                {user.isActive ? '有効' : '無効'}
                            </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                        <td>
                            <div class="actions">
                                <a href="/controller/users/{user._id}/edit" class="btn-admin-outline">編集</a>
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
