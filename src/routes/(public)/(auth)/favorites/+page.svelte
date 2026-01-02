<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';

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

<svelte:head>
    <title>お気に入り管理 | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>お気に入り管理</h1>
    </div>

    <div class="table-wrapper">
        <table class="list-table">
            <thead>
                <tr>
                    <th onclick={() => toggleSort('name')} class="sortable">TAB譜 {getSortIcon('name')}</th>
                    <th onclick={() => toggleSort('username')} class="sortable">作成ユーザー {getSortIcon('username')}</th>
                    <th onclick={() => toggleSort('updatedAt')} class="sortable">更新日時 {getSortIcon('updatedAt')}</th>
                    <th onclick={() => toggleSort('favoritedAt')} class="sortable">お気に入り日時 {getSortIcon('favoritedAt')}</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {#if data.favorites.length === 0}
                    <tr>
                        <td colspan="5" style="text-align: center;">お気に入りは登録されていません。</td>
                    </tr>
                {:else}
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
                            <td class="actions">
                                <form method="POST" action="?/removeFavorite" use:enhance>
                                    <input type="hidden" name="tabId" value={favorite.id} />
                                    <button type="submit" class="btn-danger-outline">解除</button>
                                </form>
                            </td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style>
    .actions {
        white-space: nowrap;
    }

    .list-table a {
        color: #007bff;
        text-decoration: none;
    }

    .list-table a:hover {
        text-decoration: underline;
    }
</style>
