<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

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
        const currentSortBy = url.searchParams.get('sortBy');
        const currentSortOrder = url.searchParams.get('sortOrder');

        // デフォルトは version desc なので、初回クリック時の挙動を調整
        if (!currentSortBy && field === 'version') {
            url.searchParams.set('sortBy', 'version');
            url.searchParams.set('sortOrder', 'asc');
        } else if (currentSortBy === field) {
            url.searchParams.set('sortOrder', currentSortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            url.searchParams.set('sortBy', field);
            url.searchParams.set('sortOrder', 'asc');
        }

        goto(url.toString());
    }

    function getSortIcon(field: string) {
        const currentSortBy = $page.url.searchParams.get('sortBy');
        const currentSortOrder = $page.url.searchParams.get('sortOrder');

        if (!currentSortBy && field === 'version') return '↓';
        if (currentSortBy !== field) return '↕';
        return currentSortOrder === 'asc' ? '↑' : '↓';
    }
</script>

<svelte:head>
    <title>{data.tab.name}の履歴 | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>{data.tab.name}の履歴</h1>
        <a href="/tabs" class="btn-outline">一覧に戻る</a>
    </div>

    <div class="table-wrapper">
        <table class="list-table">
            <thead>
                <tr>
                    <th onclick={() => toggleSort('version')} class="sortable">バージョン {getSortIcon('version')}</th>
                    <th>コメント</th>
                    <th onclick={() => toggleSort('updatedAt')} class="sortable">更新日時 {getSortIcon('updatedAt')}</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {#each data.histories as history}
                    <tr>
                        <td>{history.version}</td>
                        <td>{history.version_comment}</td>
                        <td>{formatDate(history.updatedAt)}</td>
                        <td class="actions">
                            <a href="/tabs/{data.tab._id}/histories/{history.version}" class="btn-outline">表示</a>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .btn-outline {
        text-decoration: none;
        display: inline-block;
        line-height: 1.5;
    }

    .sortable {
        cursor: pointer;
        user-select: none;
    }

    .sortable:hover {
        background-color: #f0f0f0;
    }
</style>
