<script lang="ts">
    let { data } = $props();
    const { tab, histories } = data;

    function formatDate(dateString: string) {
        if (!dateString) return '';
        const date = new Date(dateString);
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
    <title>バージョン履歴 - {tab.name} | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>{tab.name} - バージョン履歴</h1>
        <a href="/tab/{tab._id}" class="btn-secondary">TAB譜に戻る</a>
    </div>

    <div class="table-wrapper">
        <table class="list-table">
            <thead>
                <tr>
                    <th>バージョン</th>
                    <th>更新コメント</th>
                    <th>更新日時</th>
                </tr>
            </thead>
            <tbody>
                {#each histories as history}
                    <tr>
                        <td>
                            <a href="/tab/{tab._id}/version/{history.version}">{history.version}</a>
                        </td>
                        <td>{history.version_comment}</td>
                        <td>{formatDate(history.updatedAt)}</td>
                    </tr>
                {/each}
                {#if histories.length === 0}
                    <tr>
                        <td colspan="3" style="text-align: center;">履歴がありません。</td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>
