<script lang="ts">
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import DataTable from '$lib/components/common/DataTable.svelte';
    import VisibilityBadge from '$lib/components/common/VisibilityBadge.svelte';

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
            <FormGroup label="TAB譜名" id="name" row>
                <input type="text" id="name" name="name" value={data.searchParams.name} />
            </FormGroup>
            <FormGroup label="ユーザー名" id="username" row>
                <input type="text" id="username" name="username" value={data.searchParams.username} />
            </FormGroup>
            <div class="form-actions">
                <Button type="submit" variant="search">検索</Button>
                <Button href="/controller/tabs" variant="clear">クリア</Button>
            </div>
        </form>
    </div>

    <DataTable headers={['TAB譜名', 'ユーザー名', '公開設定', '閲覧数', 'お気に入り数', '更新日時']} isEmpty={data.tabs.length === 0}>
        {#each data.tabs as tab}
            <tr>
                <td>
                    <a href="/tab/{tab._id}" target="_blank">{tab.name}</a>
                </td>
                <td>
                    <a href="/controller/users/{tab.userId}">{tab.user.username}</a>
                </td>
                <td>
                    <VisibilityBadge status={tab.visibility} />
                </td>
                <td>{tab.viewCount ?? 0}</td>
                <td>{tab.favoriteCount ?? 0}</td>
                <td>{new Date(tab.updatedAt).toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
            </tr>
        {/each}
    </DataTable>
</div>
