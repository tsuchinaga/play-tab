<script lang="ts">
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import DataTable from '$lib/components/common/DataTable.svelte';
    import VisibilityBadge from '$lib/components/common/VisibilityBadge.svelte';

    let { data } = $props();

    function handleDelete(id: string, username: string) {
        if (confirm(`ユーザー「${username}」を本当に削除してもよろしいですか？`)) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/controller/users/${id}/delete`;
            document.body.appendChild(form);
            form.submit();
        }
    }

    function handleHardDelete(id: string, username: string) {
        if (confirm(`ユーザー「${username}」を完全に削除してもよろしいですか？\nこの操作は取り消せません。関連するすべてのデータ（TAB譜、履歴、お気に入りなど）も削除されます。`)) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/controller/users/${id}/hard-delete`;
            document.body.appendChild(form);
            form.submit();
        }
    }
</script>

<svelte:head>
    <title>ユーザー管理 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>ユーザー</h1>
    </div>

    {#if data.message}
        <div class="message {data.messageType}">
            {data.message}
        </div>
    {/if}

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
            <FormGroup label="削除済み" id="includeDeleted" row>
                <select id="includeDeleted" name="includeDeleted">
                    <option value="false" selected={!data.searchParams.includeDeleted}>非表示</option>
                    <option value="true" selected={data.searchParams.includeDeleted}>表示</option>
                </select>
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
                    {#if user.isDeleted}
                        <VisibilityBadge status="draft" label="削除済" />
                    {:else}
                        <VisibilityBadge status={user.isActive ? 'public' : 'private'} label={user.isActive ? '有効' : '無効'} />
                    {/if}
                </td>
                <td>{new Date(user.createdAt).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                <td>
                    <div class="actions">
                        {#if !user.isDeleted}
                            <Button href="/controller/users/{user._id}/edit" variant="outline">編集</Button>
                            <Button type="button" variant="danger-outline" onclick={() => handleDelete(user._id, user.username)}>削除</Button>
                        {:else}
                            <Button type="button" variant="danger-outline" onclick={() => handleHardDelete(user._id, user.username)}>完全削除</Button>
                        {/if}
                    </div>
                </td>
            </tr>
        {/each}
    </DataTable>
</div>
