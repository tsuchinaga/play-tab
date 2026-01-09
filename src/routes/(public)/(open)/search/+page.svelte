<script lang="ts">
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import DataTable from '$lib/components/common/DataTable.svelte';
    import InstrumentBadge from '$lib/components/common/InstrumentBadge.svelte';

    let { data } = $props();

    function formatDate(date: string | Date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
</script>

<svelte:head>
    <title>TAB譜検索 | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>TAB譜検索</h1>
    </div>

    <div class="search-form-container">
        <form method="GET" class="search-form">
            <FormGroup label="キーワード" id="name" row>
                <input type="text" id="name" name="name" value={data.searchParams.name} placeholder="TAB譜名で検索" />
            </FormGroup>
            <FormGroup label="楽器" id="instruments" row>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="instruments" value="Guitar" checked={data.searchParams.instruments.includes('Guitar')} />
                        Guitar
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="instruments" value="Bass" checked={data.searchParams.instruments.includes('Bass')} />
                        Bass
                    </label>
                </div>
            </FormGroup>
            <div class="form-actions">
                <Button type="submit" variant="search">検索</Button>
                <Button href="/search" variant="clear">クリア</Button>
            </div>
        </form>
    </div>

    <DataTable headers={['TAB譜名', '作成者', '楽器', '更新日時']} isEmpty={data.tabs.length === 0} emptyMessage="該当するTAB譜が見つかりませんでした。">
        {#each data.tabs as tab}
            <tr>
                <td><a href="/tab/{tab._id}">{tab.name}</a></td>
                <td><a href="/user/{tab.user._id}">{tab.user.username}</a></td>
                <td>
                    <div class="instruments-badges">
                        {#each tab.instruments as inst}
                            <InstrumentBadge instrument={inst} />
                        {/each}
                    </div>
                </td>
                <td>{formatDate(tab.updatedAt)}</td>
            </tr>
        {/each}
    </DataTable>
</div>

<style>
    .checkbox-group {
        display: flex;
        gap: 20px;
    }

    @media (max-width: 768px) {
        .checkbox-group {
            flex-direction: column;
            gap: 10px;
        }
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-weight: normal;
    }

    .checkbox-label input {
        width: auto;
    }

    .list-table a {
        color: #007bff;
        text-decoration: none;
    }

    .list-table a:hover {
        text-decoration: underline;
    }
</style>
