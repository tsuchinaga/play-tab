<script lang="ts">
    import AlphaTabPlayer from '$lib/components/tab/AlphaTabPlayer.svelte';
    import InstrumentBadge from '$lib/components/common/InstrumentBadge.svelte';
    import { instrumentGroups } from '$lib/instruments';
    import { generateFullTex } from '$lib/utils/alphatex';

    let { data } = $props();
    const { tab, history } = data;
    let viewMode = $state('tab'); // 'tab' | 'tex'

    const visibleTrackIndices = $derived(
        history.tracks.map((track: any, index: number) => track.isVisible ? index : -1).filter((index: number) => index !== -1)
    );

    const fullTex = $derived(generateFullTex({
        name: history.name,
        bpm: history.bpm,
        username: tab.user?.username || 'Guest',
        tracks: history.tracks
    }));

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
    <title>{history.name} (v{history.version}) | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>{history.name} <span class="version-badge">v{history.version}</span></h1>
        <div class="header-actions">
            <a href="/tab/{tab._id}/versions" class="btn-secondary">履歴一覧に戻る</a>
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
            <span class="label">バージョン</span>
            <span class="value">{history.version}</span>
        </div>
        <div class="info-row">
            <span class="label">更新コメント</span>
            <span class="value">{history.version_comment}</span>
        </div>
        <div class="info-row">
            <span class="label">BPM</span>
            <span class="value">{history.bpm}</span>
        </div>
        {#if history.description}
            <div class="info-row">
                <span class="label">説明</span>
                <span class="value" style="white-space: pre-wrap;">{history.description}</span>
            </div>
        {/if}
        {#if history.tracks.length > 0}
            <div class="info-row">
                <span class="label">楽器</span>
                <div class="value">
                    <ul class="instruments-list">
                        {#each history.tracks as track}
                            <li>
                                {track.name} <InstrumentBadge instrument="{track.instrument} ({track.tuning})" />
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        {/if}
        <div class="info-row">
            <span class="label">更新日時</span>
            <span class="value">{formatDate(history.updatedAt)}</span>
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
    .version-badge {
        font-size: 1rem;
        background: #6c757d;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        vertical-align: middle;
        margin-left: 10px;
    }

    .header-actions {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    @media (max-width: 768px) {
        .header-actions {
            width: 100%;
        }
        .header-actions a {
            width: 100% !important;
            text-align: center;
        }
        .info-row {
            flex-direction: column;
            gap: 4px;
        }
        .label {
            width: 100%;
        }
        .player-container {
            height: 400px;
        }
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

    .player-container {
        height: 600px;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background: #fff;
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
