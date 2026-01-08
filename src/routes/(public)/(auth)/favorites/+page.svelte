<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';
    import Button from '$lib/components/common/Button.svelte';
    import DataTable from '$lib/components/common/DataTable.svelte';

    let { data } = $props();

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function toggleSort(field: string) {
        const url = new URL($page.url);
        const currentSortBy = url.searchParams.get('sortBy') || 'favoritedAt';
        const currentSortOrder = url.searchParams.get('sortOrder') || 'desc';

        if (currentSortBy === field) {
            url.searchParams.set('sortOrder', currentSortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            url.searchParams.set('sortBy', field);
            url.searchParams.set('sortOrder', 'asc');
        }

        goto(url.toString());
    }

    function getSortIcon(field: string) {
        const currentSortBy = $page.url.searchParams.get('sortBy') || 'favoritedAt';
        const currentSortOrder = $page.url.searchParams.get('sortOrder') || 'desc';

        if (currentSortBy !== field) return '↕';
        return currentSortOrder === 'asc' ? '↑' : '↓';
    }
</script>

{#snippet header_name()}
    <th onclick={() => toggleSort('name')} class="sortable">TAB譜 {getSortIcon('name')}</th>
{/snippet}
{#snippet header_username()}
    <th onclick={() => toggleSort('username')} class="sortable">作成ユーザー {getSortIcon('username')}</th>
{/snippet}
{#snippet header_updatedAt()}
    <th onclick={() => toggleSort('updatedAt')} class="sortable">更新日時 {getSortIcon('updatedAt')}</th>
{/snippet}
{#snippet header_favoritedAt()}
    <th onclick={() => toggleSort('favoritedAt')} class="sortable">お気に入り日時 {getSortIcon('favoritedAt')}</th>
{/snippet}

<svelte:head>
    <title>お気に入り管理 | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>お気に入り管理</h1>
    </div>

    <DataTable headers={[header_name, header_username, header_updatedAt, header_favoritedAt, '操作']} isEmpty={data.favorites.length === 0} emptyMessage="お気に入りは登録されていません。">
        {#each data.favorites as favorite}
            <tr>
                <td>
                    <a href="/tab/{favorite.id}">{favorite.name}</a>
                </td>
                <td>
                    <a href="/user/{favorite.creatorId}">{favorite.creatorName}</a>
                </td>
                <td>{formatDate(favorite.updatedAt)}</td>
                <td>{formatDate(favorite.favoritedAt)}</td>
                <td>
                    <div class="actions">
                        <form method="POST" action="?/removeFavorite" use:enhance>
                            <input type="hidden" name="tabId" value={favorite.id} />
                            <Button type="submit" variant="danger-outline">解除</Button>
                        </form>
                    </div>
                </td>
            </tr>
        {/each}
    </DataTable>
</div>
