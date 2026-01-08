<script lang="ts">
    import AlphaTabViewer from './AlphaTabViewer.svelte';
    import type * as alphaTab from '@coderline/alphatab';

    interface Props {
        tex?: string;
        tracks?: number[] | 'all';
    }

    let {tex = '', tracks = 'all'} = $props<Props>();

    let api: alphaTab.AlphaTabApi | null = $state(null);
    let isPlaying = $state(false);
    let isLooping = $state(false);
    let isCountIn = $state(false);
    let isMetronome = $state(false);
    let defaultBpm = $state(120);
    let currentBpm = $state(120);
    let showTrackController = $state(false);
    let trackStates = $state<Record<number, { showStandardNotation: boolean; showTablature: boolean }>>({});

    $effect(() => {
        if (api) {
            const remover = api.playerStateChanged.on((args) => {
                isPlaying = args.state === 1; // 1 is Playing in alphaTab.Synthesizer.PlayerState
            });

            const scoreLoadedRemover = api.scoreLoaded.on((score) => {
                if (score.tempo > 0) {
                    defaultBpm = score.tempo;
                    currentBpm = score.tempo;
                }

                // トラック状態の初期化
                const newStates: Record<number, { showStandardNotation: boolean; showTablature: boolean }> = {};
                score.tracks.forEach((t) => {
                    newStates[t.index] = {
                        showStandardNotation: t.staves[0]?.showStandardNotation ?? false,
                        showTablature: t.staves[0]?.showTablature ?? false
                    };
                });
                trackStates = newStates;
            });

            // 初期状態の同期
            isLooping = api.isLooping;
            isCountIn = api.countInVolume > 0;
            isMetronome = api.metronomeVolume > 0;

            if (api.score) {
                const newStates: Record<number, { showStandardNotation: boolean; showTablature: boolean }> = {};
                api.score.tracks.forEach((t) => {
                    newStates[t.index] = {
                        showStandardNotation: t.staves[0]?.showStandardNotation ?? false,
                        showTablature: t.staves[0]?.showTablature ?? false
                    };
                });
                trackStates = newStates;
            }

            return () => {
                console.log('[AlphaTabPlayer] cleaning up events');
                remover();
                scoreLoadedRemover();
            };
        }
    });

    $effect(() => {
        if (api && defaultBpm > 0) {
            api.playbackSpeed = currentBpm / defaultBpm;
        }
    });

    function togglePlay() {
        if (!api) return;
        api.playPause();
    }

    function stop() {
        if (!api) return;
        api.stop();
    }

    function toggleLoop() {
        if (!api) return;
        isLooping = !isLooping;
        api.isLooping = isLooping;
    }

    function toggleCountIn() {
        if (!api) return;
        isCountIn = !isCountIn;
        api.countInVolume = isCountIn ? 1 : 0;
    }

    function toggleMetronome() {
        if (!api) return;
        isMetronome = !isMetronome;
        api.metronomeVolume = isMetronome ? 1 : 0;
    }

    function toggleTrackController() {
        showTrackController = !showTrackController;
    }

    function changeTrackVolume(track: alphaTab.Track, volume: number) {
        if (!api) return;
        api.changeTrackVolume([track], volume);
    }

    function toggleStave(track: alphaTab.Track) {
        if (!api) return;
        const newState = !track.staves[0]?.showStandardNotation;
        track.staves.forEach(s => s.showStandardNotation = newState);
        if (trackStates[track.index]) {
            trackStates[track.index].showStandardNotation = newState;
        }
        api.renderTracks([track]);
    }

    function toggleTab(track: alphaTab.Track) {
        if (!api) return;
        const newState = !track.staves[0]?.showTablature;
        track.staves.forEach(s => s.showTablature = newState);
        if (trackStates[track.index]) {
            trackStates[track.index].showTablature = newState;
        }
        api.renderTracks([track]);
    }
</script>

<div class="alphatab-player">
    <div class="alphatab-controller">
        <div class="controller-content">
            <button type="button" class="btn-icon" onclick={toggleTrackController} title="トラック設定">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                </svg>
            </button>
            <div class="main-controls">
                <button type="button" class="btn-icon" onclick={stop} title="停止">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <rect x="6" y="6" width="12" height="12"></rect>
                    </svg>
                </button>
                <button type="button" class="btn-icon" onclick={togglePlay} title={isPlaying ? "一時停止" : "再生"}>
                    {#if isPlaying}
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                    {:else}
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    {/if}
                </button>
                <button type="button" class="btn-icon" class:active={isLooping} onclick={toggleLoop} title="ループ再生">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
                         stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="17 1 21 5 17 9"></polyline>
                        <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                        <polyline points="7 23 3 19 7 15"></polyline>
                        <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                    </svg>
                </button>
                <button type="button" class="btn-icon count-in-toggle" class:active={isCountIn} onclick={toggleCountIn}
                        aria-pressed={isCountIn} aria-label="カウントイン" title="カウントイン">
                    <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.5"/>
                        <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.7"/>
                        <path d="M12 5.5 A6.5 6.5 0 0 1 18.5 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                        <text x="12" y="13.8" text-anchor="middle" font-size="8.5" font-family="system-ui, -apple-system, sans-serif"
                              fill="currentColor" font-weight="700">3
                        </text>
                    </svg>
                </button>
                <button type="button" class="btn-icon metronome-toggle" class:active={isMetronome} onclick={toggleMetronome}
                        aria-pressed={isMetronome} aria-label="メトロノーム" title="メトロノーム">
                    <svg class="icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                        <path d="M9 3.8c-.4 0-.8.25-.95.63L5.1 13.9c-.27.78.33 1.6 1.16 1.6H17.7c.83 0 1.43-.82 1.16-1.6l-3-8.86A1.03 1.03 0 0 0 14 3.8h-5z"
                              fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                        <rect x="6.5" y="17.2" width="11" height="2.3" rx="1.1" ry="1.1" fill="currentColor"/>
                        <path d="M12 15.6 L19.2 5.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
                        <circle cx="16.8" cy="9.8" r="1.3" fill="currentColor"/>
                    </svg>
                </button>
                <div class="tempo-controls">
                    <svg class="icon bpm-icon" viewBox="0 0 24 24" width="18" height="18" title="BPM">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"
                              fill="currentColor"/>
                    </svg>
                    <span class="bpm-label">{Math.round(currentBpm)}</span>
                    <input type="range" min="60" max="240" bind:value={currentBpm} class="bpm-slider"/>
                    <button type="button" class="btn-reset" onclick={() => currentBpm = defaultBpm} title="BPMをリセット">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                            <polyline points="3 3 3 8 8 8"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="alphatab-viewer-wrapper" class:is-playing={isPlaying}>
        {#if api && api.score && showTrackController}
            <div class="track-controller">
                <div class="track-controller-header">
                    <h3>トラック設定</h3>
                    <button type="button" class="btn-close" onclick={toggleTrackController} title="閉じる">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
                             stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="track-list">
                    {#each api.score.tracks as track}
                        <div class="track-item">
                            <div class="track-info">
                                <span class="track-name">{track.name}</span>
                                <div class="track-actions">
                                    <button type="button" class="btn-track-action"
                                            class:active={trackStates[track.index]?.showStandardNotation} onclick={() => toggleStave(track)}
                                            title="五線譜">
                                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                            <path d="M5 18h14v-1H5v1zm0-3h14v-1H5v1zm0-3h14v-1H5v1zm0-3h14V8H5v1zm0-3v1h14V6H5z"
                                                  opacity="0.3"/>
                                            <path d="M13 6v8.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V9h4V6h-6z"/>
                                        </svg>
                                    </button>
                                    <button type="button" class="btn-track-action" class:active={trackStates[track.index]?.showTablature}
                                            onclick={() => toggleTab(track)} title="TAB譜">
                                        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                            <path d="M5 19h14v-2H5v2zm0-4h14v-2H5v2zm0-4h14V9H5v2zm0-6v2h14V5H5z" opacity="0.3"/>
                                            <text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" font-weight="bold"
                                                  font-size="14" font-family="monospace">0
                                            </text>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="track-volume">
                                <input type="range" min="0" max="16" step="1" value={track.playbackInfo.volume}
                                       oninput={(e) => changeTrackVolume(track, parseInt(e.currentTarget.value))}/>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
        <AlphaTabViewer {tex} {tracks} bind:api/>
    </div>
</div>

<style>
    .alphatab-player {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    .alphatab-viewer-wrapper {
        width: 100%;
        flex: 1;
        min-height: 0;
        position: relative;
        display: flex;
    }

    .track-controller {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 280px;
        background: rgba(248, 249, 250, 0.95);
        border-right: 1px solid #dee2e6;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);
    }

    .track-controller-header {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #dee2e6;
    }

    .track-controller-header h3 {
        margin: 0;
        font-size: 1rem;
        color: #343a40;
    }

    .btn-close {
        background: transparent;
        border: none;
        cursor: pointer;
        color: #6c757d;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
    }

    .btn-close:hover {
        background: #e9ecef;
        color: #343a40;
    }

    .track-list {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
    }

    .track-item {
        background: #fff;
        border: 1px solid #dee2e6;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 8px;
    }

    .track-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    .track-name {
        font-size: 0.9rem;
        font-weight: bold;
        color: #495057;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 120px;
    }

    .track-actions {
        display: flex;
        gap: 4px;
    }

    .btn-track-action {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        padding: 0;
        cursor: pointer;
        color: #6c757d;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
    }

    .btn-track-action.active {
        background: #007bff;
        color: #fff;
        border-color: #007bff;
    }

    .btn-track-action:hover:not(.active) {
        background: #e9ecef;
    }

    .track-volume {
        display: flex;
        align-items: center;
    }

    .track-volume input {
        width: 100%;
        height: 4px;
        cursor: pointer;
    }

    /* 再生中のカーソルと選択範囲のスタイル（再生中のみ適用） */
    :global(.at-cursor-bar) {
        /* Defines the color of the bar background when a bar is played */
        background: rgba(255, 242, 0, 0.25);
    }

    .is-playing :global(.at-selection div) {
        /* Defines the color of the selection background */
        background: rgba(64, 64, 255, 0.1);
    }

    .is-playing :global(.at-cursor-beat) {
        /* Defines the beat cursor */
        background: rgba(64, 64, 255, 0.75);
        width: 3px;
    }

    .alphatab-controller {
        z-index: 10;
        display: flex;
        align-items: center;
        background: rgba(248, 249, 250, 0.9);
        border: 1px solid #dee2e6;
        box-sizing: border-box;
        position: sticky;
        top: 0;
        width: 100%;
        border-top: none;
        border-left: none;
        border-right: none;
        padding: 8px 16px;
        min-height: 52px;
    }

    .controller-content {
        display: flex;
        align-items: center;
        width: 100%;
        flex-wrap: wrap;
        gap: 8px;
    }

    .main-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        flex-wrap: wrap;
        justify-content: center;
    }

    @media (max-width: 768px) {
        .track-controller {
            width: 100%;
            border-right: none;
        }

        .alphatab-controller {
            padding: 8px;
        }

        .controller-content {
            justify-content: space-between;
        }

        .main-controls {
            position: static;
            transform: none;
            flex: 1;
            justify-content: center;
            width: 100%;
        }

        .tempo-controls {
            width: 100%;
            justify-content: center;
            order: 10;
        }

        .bpm-slider {
            flex: 1;
            min-width: 0;
        }
    }

    .tempo-controls {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 8px;
        height: 36px;
        border: 1px solid #dee2e6;
        background: #fff;
        border-radius: 4px;
    }

    .bpm-icon {
        color: #495057;
        flex-shrink: 0;
    }

    .bpm-label {
        font-size: 0.85rem;
        font-weight: bold;
        color: #495057;
        min-width: 28px;
        text-align: right;
        flex-shrink: 0;
    }

    .bpm-slider {
        width: 120px;
        cursor: pointer;
    }

    .btn-reset {
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        padding: 2px;
        cursor: pointer;
        color: #6c757d;
        border-radius: 4px;
        flex-shrink: 0;
    }

    .btn-reset:hover {
        background: #e9ecef;
        color: #007bff;
    }

    .btn-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border: 1px solid #dee2e6;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        color: #495057;
        padding: 0;
    }

    .btn-icon:hover {
        background: #f8f9fa;
        color: #007bff;
    }

    .btn-icon.active {
        background: #007bff;
        color: #fff;
        border-color: #007bff;
    }
</style>
