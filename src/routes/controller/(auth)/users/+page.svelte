<script lang="ts">
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import DataTable from '$lib/components/common/DataTable.svelte';
    import VisibilityBadge from '$lib/components/common/VisibilityBadge.svelte';

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
            <FormGroup label="ログインID" id="loginId" row>
                <input type="text" id="loginId" name="loginId" value={data.searchParams.loginId} />
            </FormGroup>
            <FormGroup label="ユーザー名" id="username" row>
                <input type="text" id="username" name="username" value={data.searchParams.username} />
            </FormGroup>
            <FormGroup label="メールアドレス" id="email" row>
                <input type="email" id="email" name="email" value={data.searchParams.email} />
            </FormGroup>
            <div class="form-actions">
                <Button type="submit" variant="search">検索</Button>
                <Button href="/controller/users" variant="clear">クリア</Button>
            </div>
        </form>
    </div>

    <DataTable headers={['ログインID', 'ユーザー名', 'メールアドレス', '状態', '登録日時', '操作']} isEmpty={data.users.length === 0}>
        {#each data.users as user}
            <tr>
                <td>{user.loginId}</td>
                <td>
                    <a href="/controller/users/{user._id}">{user.username}</a>
                </td>
                <td>{user.email}</td>
                <td>
                    <VisibilityBadge status={user.isActive ? 'public' : 'private'} label={user.isActive ? '有効' : '無効'} />
                </td>
                <td>{new Date(user.createdAt).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                <td>
                    <div class="actions">
                        <Button href="/controller/users/{user._id}/edit" variant="outline">編集</Button>
                    </div>
                </td>
            </tr>
        {/each}
    </DataTable>
</div>
