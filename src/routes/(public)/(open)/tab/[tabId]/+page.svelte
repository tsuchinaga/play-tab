<script lang="ts">
    import { enhance } from '$app/forms';
    import AlphaTabPlayer from '$lib/components/AlphaTabPlayer.svelte';

    let { data } = $props();
    const { tab, user } = data;
    const isFavorite = $derived(data.isFavorite);
    let viewMode = $state('tab'); // 'tab' | 'tex'

    // 公開状況の定義
    const statusMap = {
        public: { label: '公開', class: 'status-public' },
        private: { label: '非公開', class: 'status-private' },
        unlisted: { label: '限定公開', class: 'status-limited' }
    };

    const visibleTrackIndices = $derived(
        tab.tracks.map((track: any, index: number) => track.isVisible ? index : -1).filter((index: number) => index !== -1)
    );

    const fullTex = $derived(`\\title "${tab.name}"
\\artist "${tab.user?.username || 'Guest'}"
\\tempo ${tab.bpm}

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
        <div class="title-with-badge">
            <h1>{tab.name}</h1>
            {#if tab.visibility === 'public'}
                <span class="status-badge status-public">公開</span>
            {:else if tab.visibility === 'unlisted'}
                <span class="status-badge status-limited">限定公開</span>
            {:else if tab.visibility === 'private'}
                <span class="status-badge status-private">非公開</span>
            {/if}
        </div>
        <div class="header-actions">
            {#if data.canViewHistory}
                <a href="/tab/{tab._id}/versions" class="btn-outline">バージョン履歴</a>
            {/if}
            {#if user}
                {#if isFavorite}
                    <form method="POST" action="?/removeFavorite" use:enhance>
                        <button type="submit" class="btn-secondary">お気に入り解除</button>
                    </form>
                {:else}
                    <form method="POST" action="?/addFavorite" use:enhance>
                        <button type="submit" class="btn-primary">お気に入り登録</button>
                    </form>
                {/if}
            {/if}
        </div>
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

    {#if data.canViewTex}
        <div class="view-mode-selector">
            <button 
                type="button" 
                class:active={viewMode === 'tex'} 
                onclick={() => viewMode = 'tex'}
                title="alpatex"
            >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"></path>
                    <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"></path>
                    <path d="M15 2v5h5"></path>
                </svg>
            </button>
            <button 
                type="button" 
                class:active={viewMode === 'tab'} 
                onclick={() => viewMode = 'tab'}
                title="TAB譜"
            >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="M9 18V11l9-2v5"></path>
                    <circle cx="7" cy="18" r="2"></circle>
                    <circle cx="16" cy="16" r="2"></circle>
                </svg>
            </button>
        </div>
    {/if}

    <div class="player-container">
        {#if viewMode === 'tab'}
            <AlphaTabPlayer tex={fullTex} tracks={visibleTrackIndices} />
        {:else}
            <div class="tex-view">
                <div class="tex-header">
                    <span>alpatex</span>
                </div>
                <pre>{fullTex}</pre>
            </div>
        {/if}
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

    .btn-outline {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        height: 40px;
        border: 1px solid #007bff;
        background: transparent;
        color: #007bff;
        border-radius: 4px;
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 0.2s;
    }

    .btn-outline:hover {
        background: #007bff;
        color: white;
    }

    .title-with-badge {
        display: flex;
        align-items: center;
        gap: 1rem;
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
        min-height: 400px;
    }

    .view-mode-selector {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
    }

    .view-mode-selector button {
        padding: 8px;
        background: #fff;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #495057;
    }

    .view-mode-selector button.active {
        background: #e9ecef;
        border-color: #adb5bd;
    }

    .tex-view {
        display: flex;
        flex-direction: column;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
    }

    .tex-header {
        padding: 10px;
        background: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        font-weight: bold;
        font-size: 0.9rem;
    }

    .tex-view pre {
        flex: 1;
        margin: 0;
        padding: 15px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1rem;
        line-height: 1.5;
        white-space: pre-wrap;
        background-color: #f8f9fa;
        overflow-x: auto;
    }
</style>
