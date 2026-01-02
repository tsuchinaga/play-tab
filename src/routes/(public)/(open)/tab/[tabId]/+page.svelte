<script lang="ts">
    import { enhance } from '$app/forms';
    import AlphaTabPlayer from '$lib/components/AlphaTabPlayer.svelte';

    let { data } = $props();
    const { tab, user } = data;
    const isFavorite = $derived(data.isFavorite);

    const visibleTrackIndices = $derived(
        tab.tracks.map((track: any, index: number) => track.isVisible ? index : -1).filter((index: number) => index !== -1)
    );

    const fullTex = $derived(`\\title "${tab.name}"
\\artist "${tab.user?.username || 'Guest'}"
\\tempo ${tab.bpm}
.
${tab.tracks.map((track: any) => `\\track "${track.name}"
\\instrument "${track.instrument}"
\\tuning (${track.tuning}) {hide}
${track.tex}`).join('\n')}`);

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
</script>

<svelte:head>
    <title>{tab.name} | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>{tab.name}</h1>
        {#if user}
            <div class="header-actions">
                {#if isFavorite}
                    <form method="POST" action="?/removeFavorite" use:enhance>
                        <button type="submit" class="btn-secondary">お気に入り解除</button>
                    </form>
                {:else}
                    <form method="POST" action="?/addFavorite" use:enhance>
                        <button type="submit" class="btn-primary">お気に入り登録</button>
                    </form>
                {/if}
            </div>
        {/if}
    </div>

    <div class="tab-info-card form-card">
        <div class="info-row">
            <span class="label">作成者</span>
            <span class="value">
                {#if tab.user}
                    <a href="/user/{tab.user._id}" class="user-link">{tab.user.username}</a>
                {:else}
                    Guest
                {/if}
            </span>
        </div>
        <div class="info-row">
            <span class="label">BPM</span>
            <span class="value">{tab.bpm}</span>
        </div>
        {#if tab.tracks.length > 0}
            <div class="info-row">
                <span class="label">楽器</span>
                <div class="value">
                    <ul class="instruments-list">
                        {#each tab.tracks as track}
                            <li>
                                {track.name} <span class="instrument-badge">{track.instrument} ({track.tuning})</span>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        {/if}
        <div class="info-row">
            <span class="label">更新日時</span>
            <span class="value">{formatDate(tab.updatedAt)}</span>
        </div>
    </div>

    <div class="player-container">
        <AlphaTabPlayer tex={fullTex} tracks={visibleTrackIndices} />
    </div>
</div>

<style>
    .header-actions {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .header-actions button {
        margin: 0;
        width: 140px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tab-info-card {
        margin-bottom: 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .info-row {
        display: flex;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f1f3f5;
    }

    .info-row:last-child {
        border-bottom: none;
    }

    .label {
        width: 120px;
        font-weight: bold;
        color: #495057;
    }

    .value {
        color: #212529;
        flex: 1;
    }

    .user-link {
        color: #007bff;
        text-decoration: none;
    }

    .user-link:hover {
        text-decoration: underline;
    }

    .instruments-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .instrument-badge {
        background: #e9ecef;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.85rem;
        color: #495057;
    }

    .player-container {
        background: white;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 20px;
        min-height: 400px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
</style>
