<script lang="ts">
    import AlphaTabViewer from './AlphaTabViewer.svelte';
    import type * as alphaTab from '@coderline/alphatab';
    import { onMount, onDestroy } from 'svelte';

    interface Props {
        tex?: string;
        tracks?: number[] | 'all';
        defaultOpen?: boolean;
    }

    let { tex = '', tracks = 'all', defaultOpen = true } = $props<Props>();

    let api: alphaTab.AlphaTabApi | null = $state(null);
    let isOpen = $state(defaultOpen);
    let isPlaying = $state(false);
    let isLooping = $state(false);
    let isCountIn = $state(false);
    let isMetronome = $state(false);

    $effect(() => {
        if (api) {
            const remover = api.playerStateChanged.on((args) => {
                isPlaying = args.state === 1; // 1 is Playing in alphaTab.Synthesizer.PlayerState
            });
            
            // 初期状態の同期
            isLooping = api.isLooping;
            isCountIn = api.countInVolume > 0;
            isMetronome = api.metronomeVolume > 0;

            return () => {
                console.log('[AlphaTabPlayer] cleaning up events');
                remover();
            };
        }
    });

    function toggleOpen() {
        isOpen = !isOpen;
    }

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
</script>

<div class="alphatab-player">
    <div class="alphatab-controller" class:open={isOpen}>
        {#if isOpen}
            <div class="controller-content">
                <button type="button" class="btn-icon close-toggle" onclick={toggleOpen} title="閉じる">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
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
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                </div>
            </div>
        {:else}
            <button type="button" class="btn-icon open-toggle" onclick={toggleOpen} title="開く">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        {/if}
    </div>
    <div class="alphatab-viewer-wrapper" class:is-playing={isPlaying}>
        <AlphaTabViewer {tex} {tracks} bind:api />
    </div>
</div>

<style>
    .alphatab-player {
        position: relative;
        width: 100%;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        overflow: hidden;
    }

    .alphatab-viewer-wrapper {
        width: 100%;
    }

    /* 再生中のカーソルと選択範囲のスタイル（再生中のみ適用） */
    .is-playing :global(.at-cursor-bar) {
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
        position: absolute;
        z-index: 10;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        background: rgba(248, 249, 250, 0.9);
        border: 1px solid #dee2e6;
        box-sizing: border-box;
    }

    .alphatab-controller.open {
        top: 0;
        left: 0;
        width: 100%;
        border-top: none;
        border-left: none;
        border-right: none;
        padding: 8px 16px;
        min-height: 52px;
    }

    .alphatab-controller:not(.open) {
        top: 10px;
        left: 10px;
        width: auto;
        border-radius: 4px;
        padding: 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .controller-content {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .main-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
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

    .open-toggle, .close-toggle {
        background: transparent;
        border: none;
    }

    .open-toggle:hover, .close-toggle:hover {
        background: rgba(0, 0, 0, 0.05);
    }
</style>
