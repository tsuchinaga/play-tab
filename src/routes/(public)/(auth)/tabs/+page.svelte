<script lang="ts">
    import { page } from '$app/stores';

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
</script>

<svelte:head>
    <title>TAB譜管理 | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>TAB譜管理</h1>
        <a href="/tabs/new" class="btn-primary add-button">新規登録</a>
    </div>

    <div class="search-form-container">
        <form method="GET" class="search-form">
            <div class="search-group">
                <label for="name">名前</label>
                <input type="text" id="name" name="name" value={$page.url.searchParams.get('name') || ''} placeholder="名前で検索..." />
            </div>
            <div class="search-group">
                <label for="status">公開状況</label>
                <select id="status" name="status">
                    <option value="">すべて</option>
                    <option value="public" selected={$page.url.searchParams.get('status') === 'public'}>公開</option>
                    <option value="private" selected={$page.url.searchParams.get('status') === 'private'}>非公開</option>
                    <option value="unlisted" selected={$page.url.searchParams.get('status') === 'unlisted'}>限定公開</option>
                </select>
            </div>
            <button type="submit" class="btn-search">検索</button>
        </form>
    </div>

    <div class="table-wrapper">
        <table class="list-table">
            <thead>
                <tr>
                    <th>名前</th>
                    <th>公開状況</th>
                    <th>バージョン</th>
                    <th>作成日時</th>
                    <th>閲覧回数</th>
                    <th>評価</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {#each data.tabs as tab}
                    <tr>
                        <td>{tab.name}</td>
                        <td>
                            {#if tab.status === 'public'}
                                <span class="status-badge status-public">公開</span>
                            {:else if tab.status === 'private'}
                                <span class="status-badge status-private">非公開</span>
                            {:else if tab.status === 'unlisted'}
                                <span class="status-badge status-limited">限定公開</span>
                            {/if}
                        </td>
                        <td></td>
                        <td>{formatDate(tab.createdAt)}</td>
                        <td>{tab.views ?? ''}</td>
                        <td>{tab.rating ?? ''}</td>
                        <td class="actions">
                            <a href="/tabs/{tab.id}/edit" class="btn-outline">編集</a>
                            <button class="btn-danger-outline">削除</button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .add-button {
        width: auto;
        padding: 0.5rem 1.5rem;
        text-decoration: none;
        text-align: center;
    }
</style>
