<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';

    let { data } = $props();

    // 公開状況の定義
    const statusMap = {
        public: { label: '公開', class: 'status-public' },
        private: { label: '非公開', class: 'status-private' },
        unlisted: { label: '限定公開', class: 'status-limited' }
    };

    function formatDate(date: Date) {
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function handleDelete(id: string, name: string) {
        if (confirm(`TAB譜「${name}」を本当に削除してもよろしいですか？`)) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/tabs/${id}/delete`;
            document.body.appendChild(form);
            form.submit();
        }
    }

    function toggleSort(field: string) {
        const url = new URL($page.url);
        const currentSortBy = url.searchParams.get('sortBy');
        const currentSortOrder = url.searchParams.get('sortOrder');

        if (currentSortBy === field) {
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

        if (currentSortBy !== field) return '↕';
        return currentSortOrder === 'asc' ? '↑' : '↓';
    }
</script>

<svelte:head>
    <title>TAB譜管理 | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>TAB譜管理</h1>
        <a href="/tabs/new" class="btn-primary add-button">新規登録</a>
    </div>

    {#if data.message}
        <div class="message {data.messageType}">
            {data.message}
        </div>
    {/if}

    <div class="search-form-container">
        <form method="GET" class="search-form">
            <div class="form-group row">
                <label for="name">名前</label>
                <div class="input-container">
                    <input type="text" id="name" name="name" value={$page.url.searchParams.get('name') || ''} placeholder="名前で検索..." />
                </div>
            </div>
            <div class="form-group row">
                <label for="status">公開状況</label>
                <div class="input-container">
                    <select id="status" name="status">
                        <option value="">すべて</option>
                        <option value="public" selected={$page.url.searchParams.get('status') === 'public'}>公開</option>
                        <option value="private" selected={$page.url.searchParams.get('status') === 'private'}>非公開</option>
                        <option value="unlisted" selected={$page.url.searchParams.get('status') === 'unlisted'}>限定公開</option>
                    </select>
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-search">検索</button>
                <a href="/tabs" class="btn-clear">クリア</a>
            </div>
        </form>
    </div>

    <div class="table-wrapper">
        <table class="list-table">
            <thead>
                <tr>
                    <th onclick={() => toggleSort('name')} class="sortable">名前 {getSortIcon('name')}</th>
                    <th onclick={() => toggleSort('visibility')} class="sortable">公開状況 {getSortIcon('visibility')}</th>
                    <th onclick={() => toggleSort('updatedAt')} class="sortable">更新日時 {getSortIcon('updatedAt')}</th>
                    <th onclick={() => toggleSort('viewCount')} class="sortable">閲覧数 {getSortIcon('viewCount')}</th>
                    <th onclick={() => toggleSort('favoriteCount')} class="sortable">お気に入り数 {getSortIcon('favoriteCount')}</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {#each data.tabs as tab}
                    <tr>
                        <td>
                            <div class="name-cell">
                                <span class="tab-name">{tab.name}</span>
                                {#if tab.version}
                                    <div class="version-badge-container">
                                        <span class="version-badge">v{tab.version}</span>
                                    </div>
                                {/if}
                            </div>
                        </td>
                        <td>
                            {#if tab.status === 'public'}
                                <span class="status-badge status-public">公開</span>
                            {:else if tab.status === 'private'}
                                <span class="status-badge status-private">非公開</span>
                            {:else if tab.status === 'unlisted'}
                                <span class="status-badge status-limited">限定公開</span>
                            {/if}
                        </td>
                        <td>{formatDate(tab.updatedAt)}</td>
                        <td>{tab.viewCount}</td>
                        <td>{tab.favoriteCount}</td>
                        <td class="actions">
                            <a href="/tabs/{tab.id}/versions" class="btn-outline">履歴</a>
                            <a href="/tabs/{tab.id}/edit" class="btn-outline">編集</a>
                            <button type="button" class="btn-danger-outline" onclick={() => handleDelete(tab.id, tab.name)}>削除</button>
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

    .add-button {
        width: auto;
        padding: 0.5rem 1.5rem;
        text-decoration: none;
        text-align: center;
    }

    .message {
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 4px;
        text-align: center;
    }

    .message.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .message.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }

    .actions {
        white-space: nowrap;
    }

    .name-cell {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .tab-name {
        font-weight: 500;
    }

    .version-badge-container {
        display: block;
    }

    .version-badge {
        font-size: 0.75rem;
        background-color: #e9ecef;
        color: #495057;
        padding: 1px 6px;
        border-radius: 4px;
        border: 1px solid #dee2e6;
        display: inline-block;
    }
</style>
