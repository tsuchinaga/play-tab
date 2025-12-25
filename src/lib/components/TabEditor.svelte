<script lang="ts">
    import { enhance } from '$app/forms';
    import AlphaTabPlayer from '$lib/components/AlphaTabPlayer.svelte';

    let { data, form, isEdit = false } = $props();

    let name = $state(form?.name ?? data.tab?.name ?? '');
    let visibility = $state(form?.visibility ?? data.tab?.visibility ?? 'private');
    let bpm = $state(form?.bpm ?? data.tab?.bpm ?? 120);
    let trackCount = $state(form?.trackCount ?? data.tab?.tracks?.length ?? 1);
    let tracks = $state(form?.tracks ?? data.tab?.tracks ?? [{ name: 'Guitar', instrument: 'Electric Guitar Clean', tuning: 'E4 B3 G3 D3 A2 E2', tex: '1.1*4', isVisible: true }]);
    let selectedTrackIndex = $state(0);
    let viewMode = $state('split'); // 'tex' | 'split' | 'preview'

    // data.tab.tracks では isVisible という名前だが、このコンポーネント内では visible という名前を使っている箇所があったので統一する
    // サーバーサイドからのデータに合わせて isVisible に統一する
    if (tracks.length > 0 && tracks[0].visible !== undefined) {
        tracks.forEach((t: any) => {
            if (t.isVisible === undefined) t.isVisible = t.visible;
        });
    }

    const instrumentGroups = [
        {
            label: 'Guitar',
            options: [
                "Electric Guitar Clean",
                "Electric Guitar Jazz",
                "Overdriven Guitar",
                "Distortion Guitar",
                "Acoustic Guitar Nylon",
                "Acoustic Guitar Steel"
            ]
        },
        {
            label: 'Bass',
            options: [
                "Electric Bass Finger",
                "Electric Bass Pick",
                "Slap Bass 1",
                "Slap Bass 2",
                "Acoustic Bass"
            ]
        }
    ];

    const username = $derived(data.user?.username || 'Guest');

    // 楽器変更時にチューニングを自動設定するロジック
    function handleInstrumentChange(index: number) {
        const track = tracks[index];
        const isBass = instrumentGroups.find(g => g.label === 'Bass')?.options.includes(track.instrument);
        track.tuning = isBass ? 'G2 D2 A1 E1' : 'E4 B3 G3 D3 A2 E2';
    }

    $effect(() => {
        if (tracks.length < trackCount) {
            for (let i = tracks.length; i < trackCount; i++) {
                tracks.push({ 
                    name: '', 
                    instrument: 'Electric Guitar Clean', 
                    tuning: 'E4 B3 G3 D3 A2 E2',
                    tex: '1.1*4', 
                    isVisible: true 
                });
            }
        } else if (tracks.length > trackCount) {
            tracks.splice(trackCount);
            if (selectedTrackIndex >= trackCount) {
                selectedTrackIndex = trackCount - 1;
            }
        }
    });

    const currentTrack = $derived(tracks[selectedTrackIndex]);

    const visibleTrackIndices = $derived(
        tracks.map((track, index) => track.isVisible ? index : -1).filter(index => index !== -1)
    );

    const fullTex = $derived(`\\title "${name}"
\\artist "${username}"
\\tempo ${bpm}
.
${tracks.map(track => `\\track "${track.name}"
\\instrument "${track.instrument}"
\\tuning (${track.tuning}) {hide}
${track.tex}`).join('\n')}`);

</script>

<div class="tabs-editor-container">
    <div class="form-header">
        <h1>{isEdit ? 'TAB譜編集' : '新規TAB譜登録'}</h1>
    </div>

    <form method="POST" class="tab-form" use:enhance>
        {#if form?.message}
            <div class="error-message">{form.message}</div>
        {/if}
        <div class="form-top">
            <div class="form-group row">
                <label for="name">名前</label>
                <div class="input-container">
                    <input type="text" id="name" name="name" bind:value={name} required placeholder="曲名など" />
                </div>
            </div>

            <div class="form-group row">
                <label for="visibility">公開設定</label>
                <div class="input-container">
                    <select id="visibility" name="visibility" bind:value={visibility}>
                        <option value="public">公開</option>
                        <option value="unlisted">限定公開</option>
                        <option value="private">非公開</option>
                    </select>
                </div>
            </div>

            <div class="form-group row">
                <label for="bpm">BPM</label>
                <div class="input-container">
                    <input type="number" id="bpm" name="bpm" bind:value={bpm} min="60" max="240" required />
                </div>
            </div>

            <div class="form-group row">
                <label for="trackCount">トラック数</label>
                <div class="input-container">
                    <input type="number" id="trackCount" name="trackCount" bind:value={trackCount} min="1" max="6" required />
                </div>
            </div>

            {#each tracks as track, i}
                <div class="form-group row">
                    <label for="track-{i}" class="track-label">
                        <input type="checkbox" id="track-{i}" bind:checked={track.isVisible} title="表示/非表示" />
                        <input type="hidden" name="isVisible-{i}" value={track.isVisible} />
                    </label>
                    <div class="input-container track-inputs">
                        <input type="text" name="trackName-{i}" bind:value={track.name} placeholder="トラック名" />
                        <select name="instrument-{i}" bind:value={track.instrument} onchange={() => handleInstrumentChange(i)}>
                            {#each instrumentGroups as group}
                                <optgroup label={group.label}>
                                    {#each group.options as instrument}
                                        <option value={instrument}>{instrument}</option>
                                    {/each}
                                </optgroup>
                            {/each}
                        </select>
                        <input type="text" name="tuning-{i}" bind:value={track.tuning} placeholder="チューニング (例: E4 B3 G3 D3 A2 E2)" title="チューニング" />
                        <button 
                            type="button" 
                            class="btn-select" 
                            class:active={selectedTrackIndex === i}
                            onclick={() => selectedTrackIndex = i}
                        >
                            選択
                        </button>
                    </div>
                </div>
            {/each}
        </div>

        <div class="view-mode-selector">
            <button 
                type="button" 
                class:active={viewMode === 'tex'} 
                onclick={() => viewMode = 'tex'}
                title="texのみ"
            >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            </button>
            <button 
                type="button" 
                class:active={viewMode === 'split'} 
                onclick={() => viewMode = 'split'}
                title="texとプレビュー"
            >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 6V19C2 19 5 17 12 17V4C5 4 2 6 2 6Z"></path>
                    <line x1="5" y1="8" x2="9" y2="8"></line>
                    <line x1="5" y1="11" x2="9" y2="11"></line>
                    <line x1="5" y1="14" x2="7" y2="14"></line>
                    <path d="M22 6V19C22 19 19 17 12 17V4C19 4 22 6 22 6Z"></path>
                    <path d="M15 13.5V10l3-0.5v2.5"></path>
                    <circle cx="14" cy="13.5" r="1"></circle>
                    <circle cx="17" cy="12.5" r="1"></circle>
                </svg>
            </button>
            <button 
                type="button" 
                class:active={viewMode === 'preview'} 
                onclick={() => viewMode = 'preview'}
                title="プレビューのみ"
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

        <div class="editor-main" class:tex-only={viewMode === 'tex'} class:preview-only={viewMode === 'preview'}>
            <div class="editor-left">
                {#if viewMode !== 'preview'}
                    <div class="tex-editor">
                        <div class="tex-header">
                            <span>{currentTrack?.name || `トラック ${selectedTrackIndex + 1}`} トラック の編集</span>
                        </div>
                        <textarea 
                            name="tex-{selectedTrackIndex}"
                            bind:value={tracks[selectedTrackIndex].tex}
                            spellcheck="false"
                        ></textarea>
                        {#each tracks as track, i}
                            {#if i !== selectedTrackIndex}
                                <input type="hidden" name="tex-{i}" value={track.tex} />
                            {/if}
                        {/each}
                    </div>
                {/if}
            </div>
            
            <div class="editor-right">
                {#if viewMode !== 'tex'}
                    <div class="preview-editor">
                        <div class="preview-header">
                            <span>プレビュー</span>
                        </div>
                        <div class="preview-container">
                            <AlphaTabPlayer tex={fullTex} tracks={visibleTrackIndices} defaultOpen={false} />
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        <div class="form-actions">
            <a href="/tabs" class="btn-secondary">キャンセル</a>
            <button type="submit" class="btn-primary">{isEdit ? '更新する' : '登録する'}</button>
        </div>
    </form>
</div>

<style>
    .tabs-editor-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .form-header {
        margin-bottom: 20px;
    }

    .form-header h1 {
        font-size: 1.5rem;
        color: #333;
    }

    .tab-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .error-message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #f5c6cb;
    }

    .form-top {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border: 1px solid #dee2e6;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .form-group.row {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .form-group.row label {
        width: 120px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .form-group.row label.track-label {
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .track-label input[type="checkbox"] {
        width: auto;
        margin: 0;
        cursor: pointer;
    }

    .input-container {
        flex: 1;
    }

    .input-container input[type="text"],
    .input-container input[type="number"],
    .input-container select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 1rem;
    }

    .track-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr auto;
        gap: 10px;
    }

    .btn-select {
        padding: 8px 16px;
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        cursor: pointer;
    }

    .btn-select.active {
        background: #007bff;
        color: #fff;
        border-color: #007bff;
    }

    .view-mode-selector {
        display: flex;
        justify-content: center;
        gap: 10px;
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
    }

    .view-mode-selector button.active {
        background: #e9ecef;
        border-color: #adb5bd;
    }

    .editor-main {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .editor-main.tex-only {
        grid-template-columns: 1fr;
    }

    .editor-main.preview-only {
        grid-template-columns: 1fr;
    }

    .editor-main.tex-only .editor-right {
        display: none;
    }

    .editor-main.preview-only .editor-left {
        display: none;
    }

    .editor-left, .editor-right {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .tex-editor {
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

    .tex-editor textarea {
        flex: 1;
        width: 100%;
        padding: 15px;
        border: none;
        resize: none;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1rem;
        line-height: 1.5;
        min-height: 600px;
        background-color: lightyellow;
        box-sizing: border-box;
        display: block;
    }

    .tex-editor textarea:focus {
        outline: none;
    }

    .preview-editor {
        display: flex;
        flex-direction: column;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
    }

    .preview-header {
        padding: 10px;
        background: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        font-weight: bold;
        font-size: 0.9rem;
    }

    .preview-container {
        flex: 1;
        background: #fff;
    }

    .form-actions {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 10px;
    }

    .btn-primary {
        width: 140px;
        padding: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        text-align: center;
    }

    .btn-primary:hover {
        background-color: #0069d9;
    }

    .btn-secondary {
        width: 140px;
        padding: 10px;
        background-color: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        text-decoration: none;
        cursor: pointer;
        text-align: center;
    }

    .btn-secondary:hover {
        background-color: #5a6268;
    }
</style>
