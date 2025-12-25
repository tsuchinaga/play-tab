<script lang="ts">
    import { enhance } from '$app/forms';
    import AlphaTabViewer from '$lib/components/AlphaTabViewer.svelte';

    let { data, form } = $props();

    let name = $state(form?.name ?? '');
    let visibility = $state(form?.visibility ?? 'private');
    let bpm = $state(form?.bpm ?? 120);
    let trackCount = $state(form?.trackCount ?? 1);
    let tracks = $state(form?.tracks ?? [{ name: 'Guitar', instrument: 'Electric Guitar Clean', tuning: 'E4 B3 G3 D3 A2 E2', tex: '1.1*4', visible: true }]);
    let selectedTrackIndex = $state(0);
    let viewMode = $state('split'); // 'tex' | 'split' | 'preview'

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

    $effect(() => {
        tracks.forEach(track => {
            const isBass = instrumentGroups.find(g => g.label === 'Bass')?.options.includes(track.instrument);
            const defaultTuning = isBass ? 'G2 D2 A1 E1' : 'E4 B3 G3 D3 A2 E2';
            
            // 楽器が変更され、かつチューニングがまだデフォルトのままであれば更新する
            // (ユーザーが手動で変更した場合は上書きしないようにしたいが、今のロジックでは難しいので
            // とりあえず楽器変更時に連動させる)
            // track.instrument を監視対象にする
        });
    });

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
                    visible: true 
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
        tracks.map((track, index) => track.visible ? index : -1).filter(index => index !== -1)
    );

    const fullTex = $derived(`\\title "${name}"
\\artist "${username}"
\\tempo ${bpm}
.
${tracks.map(track => `\\track "${track.name}"
\\instrument "${track.instrument}"
\\tuning (${track.tuning}) {hide}
${track.tex}`).join('\n')}`);

    $effect(() => {
        console.log('fullTex debug:', fullTex);
    });

    function handleSubmit(event: Event) {
        // 今後実装予定
        event.preventDefault();
        console.log({ name, visibility, bpm, trackCount, tracks, fullTex });
    }
</script>

<svelte:head>
    <title>新規TAB譜登録 | Play Tab</title>
</svelte:head>

<div class="tabs-new-container">
    <div class="form-header">
        <h1>新規TAB譜登録</h1>
    </div>

    <form method="POST" use:enhance class="tab-form">
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
                    <label for="track-{i}">
                        <input type="checkbox" bind:checked={track.visible} title="表示/非表示" />
                        <input type="hidden" name="isVisible-{i}" value={track.visible} />
                        トラック{i + 1}
                    </label>
                    <div class="input-container track-inputs">
                        <input type="text" id="track-{i}" name="trackName-{i}" bind:value={track.name} placeholder="トラック名" />
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
                    <!-- 左側のページ (テキスト) -->
                    <path d="M2 6V19C2 19 5 17 12 17V4C5 4 2 6 2 6Z"></path>
                    <line x1="5" y1="8" x2="9" y2="8"></line>
                    <line x1="5" y1="11" x2="9" y2="11"></line>
                    <line x1="5" y1="14" x2="7" y2="14"></line>
                    <!-- 右側のページ (音符) -->
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

        <div class="form-main" class:view-tex={viewMode === 'tex'} class:view-preview={viewMode === 'preview'}>
            <div class="form-left">
                <div class="form-group tex-group">
                    <label for="tex">
                        トラック{selectedTrackIndex + 1}: {currentTrack?.name || '(未設定)'} ({currentTrack?.instrument}) [{currentTrack?.tuning}]
                    </label>
                    <textarea 
                        id="tex" 
                        name="tex-{selectedTrackIndex}"
                        bind:value={tracks[selectedTrackIndex].tex} 
                        placeholder="alphaTexを入力してください"
                    ></textarea>
                    {#each tracks as track, i}
                        {#if i !== selectedTrackIndex}
                            <input type="hidden" name="tex-{i}" value={track.tex} />
                        {/if}
                    {/each}
                </div>
            </div>

            <div class="form-right">
                <div class="preview-header">プレビュー</div>
                <div class="preview-container">
                    <AlphaTabViewer tex={fullTex} tracks={visibleTrackIndices} />
                </div>
            </div>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn-primary">登録する</button>
            <a href="/tabs" class="btn-secondary">キャンセル</a>
        </div>
    </form>
</div>

<style>
    .error-message {
        background-color: #dc3545;
        color: white;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .tabs-new-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .form-header {
        margin-bottom: 2rem;
    }

    .form-header h1 {
        margin: 0;
        font-size: 1.75rem;
        color: #333;
    }

    .tab-form {
        background-color: #fff;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .form-top {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid #eee;
    }

    .form-group.row {
        display: flex;
        align-items: center;
        margin-bottom: 0;
    }

    .form-group.row label {
        width: 120px;
        margin-bottom: 0;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .form-group.row label input[type="checkbox"] {
        width: auto;
        margin: 0;
    }

    .input-container {
        flex: 1;
        max-width: 800px;
    }

    .track-inputs {
        display: flex;
        gap: 0.5rem;
        max-width: 800px;
    }

    .track-inputs input[type="text"] {
        flex: 3;
    }

    .track-inputs select {
        flex: 3;
    }

    .track-inputs input[type="text"]:nth-of-type(2) {
        flex: 4;
    }

    .btn-select {
        flex: 1;
        padding: 0.375rem 0.75rem;
        font-size: 0.875rem;
        color: #007bff;
        background-color: transparent;
        border: 1px solid #007bff;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
    }

    .btn-select:hover {
        background-color: rgba(0, 123, 255, 0.1);
    }

    .btn-select.active {
        color: #fff;
        background-color: #007bff;
    }

    .form-group select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 1rem;
        background-color: #fff;
    }

    .view-mode-selector {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .view-mode-selector button {
        padding: 0.5rem 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        border-radius: 4px 4px 0 0;
        cursor: pointer;
        color: #6c757d;
        transition: all 0.2s;
        min-width: 50px;
    }


    .view-mode-selector button:hover {
        background-color: #e9ecef;
    }

    .view-mode-selector button.active {
        background-color: #fff;
        border-bottom-color: #fff;
        color: #007bff;
        font-weight: bold;
        position: relative;
        z-index: 1;
        margin-bottom: -1px;
    }

    .form-main {
        display: flex;
        gap: 2rem;
        height: 600px;
        margin-bottom: 2rem;
    }

    .form-main.view-tex .form-right {
        display: none;
    }

    .form-main.view-tex .form-left {
        flex: 1;
    }

    .form-main.view-preview .form-left {
        display: none;
    }

    .form-main.view-preview .form-right {
        flex: 1;
    }

    .form-left {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .form-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: #495057;
    }

    .form-group input[type="text"],
    .form-group input[type="number"],
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        font-size: 1rem;
    }

    .form-group textarea {
        flex: 1;
        min-height: 300px;
        font-family: monospace;
        resize: none;
    }

    .tex-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-bottom: 0;
    }

    .tex-group label {
        height: 24px;
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .preview-header {
        font-weight: bold;
        height: 24px;
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        color: #495057;
    }

    .preview-container {
        flex: 1;
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #dee2e6;
    }

    .form-actions {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #eee;
    }

    .btn-primary {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s;
        white-space: nowrap;
        min-width: 120px;
    }

    .btn-primary:hover {
        background-color: #0069d9;
    }

    .btn-secondary {
        display: inline-block;
        padding: 0.75rem 2rem;
        border: 1px solid #ced4da;
        border-radius: 4px;
        color: #6c757d;
        text-decoration: none;
        transition: background-color 0.2s;
        white-space: nowrap;
        min-width: 120px;
        text-align: center;
    }

    .btn-secondary:hover {
        background-color: #e2e6ea;
    }

    @media (max-width: 992px) {
        .form-main {
            flex-direction: column;
            min-height: auto;
        }
        .form-left, .form-right {
            height: 400px;
            flex: none;
        }
        .form-group.row {
            flex-direction: column;
            align-items: flex-start;
        }
        .form-group.row label {
            width: 100%;
            margin-bottom: 0.5rem;
        }
        .input-container {
            width: 100%;
            max-width: none;
        }
    }
</style>
