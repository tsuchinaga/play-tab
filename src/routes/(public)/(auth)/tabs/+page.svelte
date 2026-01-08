<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import DataTable from '$lib/components/common/DataTable.svelte';
    import StatusBadge from '$lib/components/common/StatusBadge.svelte';

    let { data } = $props();

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

{#snippet header_name()}
    <th onclick={() => toggleSort('name')} class="sortable">名前 {getSortIcon('name')}</th>
{/snippet}
{#snippet header_visibility()}
    <th onclick={() => toggleSort('visibility')} class="sortable">公開状況 {getSortIcon('visibility')}</th>
{/snippet}
{#snippet header_updatedAt()}
    <th onclick={() => toggleSort('updatedAt')} class="sortable">更新日時 {getSortIcon('updatedAt')}</th>
{/snippet}
{#snippet header_viewCount()}
    <th onclick={() => toggleSort('viewCount')} class="sortable">閲覧数 {getSortIcon('viewCount')}</th>
{/snippet}
{#snippet header_favoriteCount()}
    <th onclick={() => toggleSort('favoriteCount')} class="sortable">お気に入り数 {getSortIcon('favoriteCount')}</th>
{/snippet}

<svelte:head>
    <title>TAB譜管理 | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>TAB譜管理</h1>
        <Button href="/tabs/new" variant="primary">新規登録</Button>
    </div>

    {#if data.message}
        <div class="message {data.messageType}">
            {data.message}
        </div>
    {/if}

    <div class="search-form-container">
        <form method="GET" class="search-form">
            <FormGroup label="名前" id="name" row>
                <input type="text" id="name" name="name" value={$page.url.searchParams.get('name') || ''} placeholder="名前で検索..." />
            </FormGroup>
            <FormGroup label="公開状況" id="status" row>
                <select id="status" name="status">
                    <option value="">すべて</option>
                    <option value="public" selected={$page.url.searchParams.get('status') === 'public'}>公開</option>
                    <option value="private" selected={$page.url.searchParams.get('status') === 'private'}>非公開</option>
                    <option value="unlisted" selected={$page.url.searchParams.get('status') === 'unlisted'}>限定公開</option>
                </select>
            </FormGroup>
            <div class="form-actions">
                <Button type="submit" variant="search">検索</Button>
                <Button href="/tabs" variant="clear">クリア</Button>
            </div>
        </form>
    </div>

    <DataTable headers={[header_name, header_visibility, header_updatedAt, header_viewCount, header_favoriteCount, '操作']} isEmpty={data.tabs.length === 0} emptyMessage="TAB譜が登録されていません。">
        {#each data.tabs as tab}
            <tr>
                <td>
                    <div class="name-cell">
                        <a href="/tab/{tab.id}" class="tab-name">{tab.name}</a>
                    </div>
                </td>
                <td>
                    <StatusBadge status={tab.status === 'unlisted' ? 'limited' : tab.status} label={tab.status === 'public' ? '公開' : tab.status === 'private' ? '非公開' : '限定公開'} />
                </td>
                <td>{formatDate(tab.updatedAt)}</td>
                <td>{tab.viewCount}</td>
                <td>{tab.favoriteCount}</td>
                <td>
                    <div class="actions">
                        <Button href="/tabs/{tab.id}/versions" variant="outline">履歴</Button>
                        <Button href="/tabs/{tab.id}/edit" variant="outline">編集</Button>
                        <Button type="button" variant="danger-outline" onclick={() => handleDelete(tab.id, tab.name)}>削除</Button>
                    </div>
                </td>
            </tr>
        {/each}
    </DataTable>
</div>

<style>
    .name-cell {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    }

    .tab-name {
        font-weight: 500;
        color: #007bff;
        text-decoration: none;
    }

    .tab-name:hover {
        text-decoration: underline;
    }
</style>
