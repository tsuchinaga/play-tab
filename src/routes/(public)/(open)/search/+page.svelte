<script lang="ts">
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
    <title>TAB譜検索 - Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>TAB譜検索</h1>
    </div>

    <div class="search-form-container">
        <form method="GET" class="search-form">
            <div class="form-group row">
                <label for="name">キーワード</label>
                <div class="input-container">
                    <input type="text" id="name" name="name" value={data.searchParams.name} placeholder="TAB譜名で検索" />
                </div>
            </div>
            <div class="form-group row">
                <label>楽器</label>
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
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-search">検索</button>
                <a href="/search" class="btn-clear">クリア</a>
            </div>
        </form>
    </div>

    <div class="table-wrapper">
        <table class="list-table">
            <thead>
                <tr>
                    <th>TAB譜名</th>
                    <th>作成者</th>
                    <th>楽器</th>
                    <th>更新日時</th>
                </tr>
            </thead>
            <tbody>
                {#if data.tabs.length === 0}
                    <tr>
                        <td colspan="4" class="empty-message">該当するTAB譜が見つかりませんでした。</td>
                    </tr>
                {:else}
                    {#each data.tabs as tab}
                        <tr>
                            <td><a href="/tab/{tab._id}">{tab.name}</a></td>
                            <td><a href="/user/{tab.user._id}">{tab.user.username}</a></td>
                            <td>
                                <div class="instruments-badges">
                                    {#each tab.instruments as inst}
                                        <span class="status-badge status-instrument">{inst}</span>
                                    {/each}
                                </div>
                            </td>
                            <td>{formatDate(tab.updatedAt)}</td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
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

    .instruments-badges {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
    }

    .status-instrument {
        background-color: #e7f3ff;
        color: #007bff;
        border: 1px solid #b3d7ff;
    }

    .empty-message {
        text-align: center;
        padding: 40px;
        color: #6c757d;
    }

    .table-wrapper {
        margin-top: 1rem;
    }

    .list-table a {
        color: #007bff;
        text-decoration: none;
    }

    .list-table a:hover {
        text-decoration: underline;
    }
</style>
