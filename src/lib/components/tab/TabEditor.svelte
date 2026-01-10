<script lang="ts">
    import {enhance} from '$app/forms';
    import {onMount, untrack} from 'svelte';
    import {browser} from '$app/environment';
    import AlphaTabPlayer from '$lib/components/tab/AlphaTabPlayer.svelte';
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import FormCard from '$lib/components/common/FormCard.svelte';
    import {instrumentGroups} from '$lib/instruments';
    import {generateFullTex} from '$lib/utils/alphatex';
    import type * as alphaTabType from "@coderline/alphatab";

    let {data, form, isEdit = false, readonly = false} = $props();

    let alphaTabLib = $state<typeof alphaTabType | null>(null);
    let cm = $state<any>(null);

    onMount(async () => {
        if (browser) {
            const [at, cmModules] = await Promise.all([
                import("@coderline/alphatab"),
                Promise.all([
                    import('codemirror'),
                    import('@codemirror/state'),
                    import('@codemirror/lint'),
                    import('@codemirror/theme-one-dark')
                ])
            ]);
            alphaTabLib = at;
            const [
                {EditorView, basicSetup},
                {EditorState},
                {lintGutter, setDiagnostics, linter},
                {oneDark}
            ] = cmModules;
            cm = {EditorView, basicSetup, EditorState, lintGutter, setDiagnostics, linter, oneDark};
        }
    });

    let name = $state(form?.name ?? data.tab?.name ?? data.history?.name ?? '');
    let visibility = $state(form?.visibility ?? data.tab?.visibility ?? data.history?.visibility ?? 'private');
    let texPublicSetting = $state(form?.texPublicSetting ?? data.tab?.texPublicSetting ?? data.history?.texPublicSetting ?? 'private');
    let historyPublicSetting = $state(form?.historyPublicSetting ?? data.tab?.historyPublicSetting ?? data.history?.historyPublicSetting ?? 'private');
    let bpm = $state(form?.bpm ?? data.tab?.bpm ?? data.history?.bpm ?? 120);
    let trackCount = $state(form?.trackCount ?? data.tab?.tracks?.length ?? data.history?.tracks?.length ?? 1);
    let tracks = $state(form?.tracks ?? data.tab?.tracks ?? data.history?.tracks ?? [{
        name: 'Guitar',
        instrument: 'Electric Guitar Clean',
        tuning: 'E4 B3 G3 D3 A2 E2',
        tex: '',
        isVisible: true
    }]);
    let selectedTrackIndex = $state(0);
    let viewMode = $state('split'); // 'full-tex' | 'tex' | 'split' | 'preview'
    let versionComment = $state(form?.versionComment ?? data.history?.version_comment ?? (isEdit ? '' : '新規登録'));
    let trackDiagnostics = $state<any[]>([]);
    let fullTexDiagnostics = $state<any[]>([]);

    const hasErrors = $derived(
        trackDiagnostics.some(d => d.severity === 2) ||
        fullTexDiagnostics.some(d => d.severity === 2)
    );

    // data.tab.tracks では isVisible という名前だが、このコンポーネント内では visible という名前を使っている箇所があったので統一する
    // サーバーサイドからのデータに合わせて isVisible に統一する
    if (tracks.length > 0 && tracks[0].visible !== undefined) {
        tracks.forEach((t: any) => {
            if (t.isVisible === undefined) t.isVisible = t.visible;
        });
    }


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
                    tex: '',
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

    let errorElement = $state<HTMLElement | null>(null);
    $effect(() => {
        if (form?.message && errorElement) {
            errorElement.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    });

    const visibleTrackIndices = $derived(
        tracks
            .filter(track => track.tex.trim() !== '')
            .map((track, index) => track.isVisible ? index : -1)
            .filter(index => index !== -1)
    );

    const fullTex = $derived(generateFullTex({
        name,
        bpm,
        username,
        tracks
    }));

    let validatedTex = $state(fullTex);
    let mainEditorContainer = $state<HTMLDivElement>();
    let mainEditorView = $state<any>();
    let fullTexEditorContainer = $state<HTMLDivElement>();
    let fullTexEditorView = $state<any>();

    // scrollToOffset 関数の実装
    function scrollToOffset(offset: number) {
        if (mainEditorView) {
            mainEditorView.dispatch({
                selection: {anchor: offset, head: offset},
                scrollIntoView: true
            });
            mainEditorView.focus();
        }
    }

    function scrollFullTexToOffset(offset: number) {
        if (fullTexEditorView) {
            fullTexEditorView.dispatch({
                selection: {anchor: offset, head: offset},
                scrollIntoView: true
            });
            fullTexEditorView.focus();
        }
    }

    // 診断情報の変換
    function convertDiagnostics(diagnostics: any[], docLength: number) {
        return (diagnostics || []).map((d: any) => {
            const from = Math.min(d.start ? d.start.offset : 0, docLength);
            let to = d.end ? d.end.offset : from;
            if (from === to && from < docLength) {
                to = from + 1;
            }
            return {
                from,
                to: Math.min(to, docLength),
                severity: d.severity === 2 ? 'error' : (d.severity === 1 ? 'warning' : 'info'),
                message: d.message
            };
        });
    }

    // メインエディタのライフサイクル
    $effect(() => {
        if (!cm || !mainEditorContainer) return;

        const state = cm.EditorState.create({
            doc: untrack(() => tracks[selectedTrackIndex].tex),
            extensions: [
                cm.basicSetup,
                cm.EditorState.readOnly.of(readonly),
                cm.EditorView.editable.of(!readonly),
                cm.oneDark,
                cm.EditorView.updateListener.of((update: any) => {
                    if (update.docChanged) {
                        const newValue = update.state.doc.toString();
                        if (newValue !== tracks[selectedTrackIndex].tex) {
                            tracks[selectedTrackIndex].tex = newValue;
                        }
                    }
                }),
                cm.linter(null),
                cm.lintGutter(),
                cm.EditorView.theme({
                    "&": {height: "100%"},
                    ".cm-scroller": {overflow: "auto"}
                })
            ]
        });

        mainEditorView = new cm.EditorView({
            state,
            parent: mainEditorContainer
        });

        return () => {
            mainEditorView.destroy();
            mainEditorView = undefined;
        };
    });

    // 診断情報の反映 (メインエディタ用)
    $effect(() => {
        if (mainEditorView && cm) {
            const converted = convertDiagnostics(trackDiagnostics, mainEditorView.state.doc.length);
            mainEditorView.dispatch(cm.setDiagnostics(mainEditorView.state, converted));
        }
    });

    // 値の同期 (メインエディタ用)
    $effect(() => {
        const value = tracks[selectedTrackIndex].tex;
        if (mainEditorView && mainEditorView.state.doc.toString() !== value) {
            mainEditorView.dispatch({
                changes: {from: 0, to: mainEditorView.state.doc.length, insert: value}
            });
        }
    });

    // フルTexエディタのライフサイクル
    $effect(() => {
        if (!cm || !fullTexEditorContainer) return;

        const state = cm.EditorState.create({
            doc: untrack(() => fullTex),
            extensions: [
                cm.basicSetup,
                cm.EditorState.readOnly.of(true),
                cm.EditorView.editable.of(true),
                cm.oneDark,
                cm.linter(null),
                cm.lintGutter(),
                cm.EditorView.theme({
                    "&": {height: "100%"},
                    ".cm-scroller": {overflow: "auto"}
                })
            ]
        });

        fullTexEditorView = new cm.EditorView({
            state,
            parent: fullTexEditorContainer
        });

        return () => {
            fullTexEditorView.destroy();
            fullTexEditorView = undefined;
        };
    });

    // フルTexエディタの値の同期
    $effect(() => {
        const value = fullTex;
        if (fullTexEditorView && fullTexEditorView.state.doc.toString() !== value) {
            fullTexEditorView.dispatch({
                changes: {from: 0, to: fullTexEditorView.state.doc.length, insert: value}
            });
        }
    });

    // フルTexエディタの診断情報の同期
    $effect(() => {
        if (fullTexEditorView && cm) {
            const converted = convertDiagnostics(fullTexDiagnostics, fullTexEditorView.state.doc.length);
            fullTexEditorView.dispatch(cm.setDiagnostics(fullTexEditorView.state, converted));
        }
    });

    $effect(() => {
        if (!alphaTabLib) return;
        const trackTex = currentTrack.tex;
        const currentFullTex = fullTex;

        // トラック個別のチェック
        const trackImporter = new alphaTabLib.importer.AlphaTexImporter();
        try {
            if (trackTex.trim() !== '') {
                trackImporter.initFromString(trackTex, new alphaTabLib.Settings());
                trackImporter.readScore();
            }
        } catch (e) {
            console.log('[AlphaTex Track Error]', e);
        } finally {
            const allDiagnostics = trackTex.trim() === '' ? [] : [
                ...trackImporter.lexerDiagnostics,
                ...trackImporter.parserDiagnostics,
                ...trackImporter.semanticDiagnostics
            ];
            trackDiagnostics = allDiagnostics.map(d => ({
                start: d.start ? {line: d.start.line, col: d.start.col, offset: d.start.offset} : null,
                end: d.end ? {line: d.end.line, col: d.end.col, offset: d.end.offset} : null,
                severity: d.severity,
                message: d.message
            }));
        }

        // 全体のチェック
        const fullImporter = new alphaTabLib.importer.AlphaTexImporter();
        try {
            fullImporter.initFromString(currentFullTex, new alphaTabLib.Settings());
            fullImporter.readScore();
            validatedTex = currentFullTex;
        } catch (e) {
            console.log('[AlphaTex Full Error]', e);
        } finally {
            const allDiagnostics = [
                ...fullImporter.lexerDiagnostics,
                ...fullImporter.parserDiagnostics,
                ...fullImporter.semanticDiagnostics
            ];
            fullTexDiagnostics = allDiagnostics.map(d => ({
                start: d.start ? {line: d.start.line, col: d.start.col, offset: d.start.offset} : null,
                end: d.end ? {line: d.end.line, col: d.end.col, offset: d.end.offset} : null,
                severity: d.severity,
                message: d.message
            }));
        }
    });

</script>

<div class="tabs-editor-container">
    <div class="list-header">
        <h1>{readonly ? 'TAB譜履歴表示' : (isEdit ? 'TAB譜編集' : '新規TAB譜登録')}</h1>
    </div>

    <form method="POST" class="tab-form" use:enhance={({ cancel }) => {
        if (hasErrors) cancel();
    }}>
        {#if form?.message}
            <div class="error-message" bind:this={errorElement}>{form.message}</div>
        {/if}
        <FormCard class="form-top">
            <FormGroup label="名前" id="name" row>
                <input type="text" id="name" name="name" bind:value={name} required placeholder="曲名など" {readonly}/>
            </FormGroup>

            <FormGroup label="公開設定" id="visibility" row>
                <select id="visibility" name="visibility" bind:value={visibility} disabled={readonly}>
                    <option value="public">公開</option>
                    <option value="unlisted">限定公開</option>
                    <option value="private">非公開</option>
                </select>
                {#if readonly}
                    <input type="hidden" name="visibility" value={visibility}/>
                {/if}
            </FormGroup>

            <FormGroup label="BPM" id="bpm" row>
                <input type="number" id="bpm" name="bpm" bind:value={bpm} min="60" max="240" required {readonly}/>
            </FormGroup>

            <FormGroup label="トラック数" id="trackCount" row>
                <input type="number" id="trackCount" name="trackCount" bind:value={trackCount} min="1" max="6" required {readonly}/>
            </FormGroup>

            {#each tracks as track, i}
                <FormGroup id="track-{i}" row>
                    {#snippet labelSnippet()}
                        <label for="track-{i}" class="track-label">
                            <input type="checkbox" id="track-{i}" bind:checked={track.isVisible} title="表示/非表示" disabled={readonly}/>
                            <input type="hidden" name="isVisible-{i}" value={track.isVisible}/>
                        </label>
                    {/snippet}
                    <div class="track-inputs">
                        <input type="text" name="trackName-{i}" bind:value={track.name} placeholder="トラック名" {readonly}/>
                        <select name="instrument-{i}" bind:value={track.instrument} onchange={() => handleInstrumentChange(i)}
                                disabled={readonly}>
                            {#each instrumentGroups as group}
                                <optgroup label={group.label}>
                                    {#each group.options as instrument}
                                        <option value={instrument}>{instrument}</option>
                                    {/each}
                                </optgroup>
                            {/each}
                        </select>
                        {#if readonly}
                            <input type="hidden" name="instrument-{i}" value={track.instrument}/>
                        {/if}
                        <input type="text" name="tuning-{i}" bind:value={track.tuning} placeholder="チューニング (例: E4 B3 G3 D3 A2 E2)"
                               title="チューニング" {readonly}/>
                        <button
                                type="button"
                                class="btn-select"
                                class:active={selectedTrackIndex === i}
                                onclick={() => selectedTrackIndex = i}
                        >
                            選択
                        </button>
                    </div>
                </FormGroup>
            {/each}
        </FormCard>

        <div class="view-mode-selector">
            <button
                    type="button"
                    class:active={viewMode === 'full-tex'}
                    onclick={() => viewMode = 'full-tex'}
                    title="tex全文"
            >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round">
                    <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z"></path>
                    <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8"></path>
                    <path d="M15 2v5h5"></path>
                </svg>
            </button>
            <button
                    type="button"
                    class:active={viewMode === 'tex'}
                    onclick={() => viewMode = 'tex'}
                    title="texのみ"
            >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round">
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
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round">
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
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                     stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <path d="M9 18V11l9-2v5"></path>
                    <circle cx="7" cy="18" r="2"></circle>
                    <circle cx="16" cy="16" r="2"></circle>
                </svg>
            </button>
        </div>

        <div class="editor-main" class:full-tex-only={viewMode === 'full-tex'} class:tex-only={viewMode === 'tex'}
             class:preview-only={viewMode === 'preview'}>
            {#if viewMode === 'full-tex'}
                <div class="full-tex-editor">
                    <div class="tex-header">
                        <span>tex全文</span>
                        {#if fullTexDiagnostics.length > 0}
                            <span class="error-count-badge">{fullTexDiagnostics.length}</span>
                        {/if}
                    </div>
                    {#if fullTexDiagnostics.length > 0}
                        <div class="track-error-list">
                            {#each fullTexDiagnostics as diag}
                                <button
                                        type="button"
                                        class="track-error-item"
                                        class:error={diag.severity === 2}
                                        class:warning={diag.severity === 1}
                                        onclick={() => scrollFullTexToOffset(diag.start?.offset || 0)}
                                >
                                    <span class="error-pos">Line {diag.start?.line}:</span>
                                    <span class="error-msg">{diag.message}</span>
                                </button>
                            {/each}
                        </div>
                    {/if}
                    <div class="code-editor-container" bind:this={fullTexEditorContainer}></div>
                </div>
            {/if}
            <div class="editor-left">
                {#if viewMode !== 'preview' && viewMode !== 'full-tex'}
                    <div class="tex-editor">
                        <div class="tex-header">
                            <div class="header-left">
                                <select bind:value={selectedTrackIndex} class="track-select">
                                    {#each tracks as track, i}
                                        <option value={i}>{track.name || `トラック ${i + 1}`}</option>
                                    {/each}
                                </select>
                                <span>トラック の編集</span>
                            </div>
                            {#if trackDiagnostics.length > 0}
                                <span class="error-count-badge">{trackDiagnostics.length}</span>
                            {/if}
                        </div>
                        {#if trackDiagnostics.length > 0}
                            <div class="track-error-list">
                                {#each trackDiagnostics as diag}
                                    <button
                                            type="button"
                                            class="track-error-item"
                                            class:error={diag.severity === 2}
                                            class:warning={diag.severity === 1}
                                            onclick={() => scrollToOffset(diag.start?.offset || 0)}
                                    >
                                        <span class="error-pos">Line {diag.start?.line}:</span>
                                        <span class="error-msg">{diag.message}</span>
                                    </button>
                                {/each}
                            </div>
                        {/if}
                        <div class="code-editor-container" bind:this={mainEditorContainer}></div>
                        <input type="hidden" name="tex-{selectedTrackIndex}" value={tracks[selectedTrackIndex].tex}/>
                        {#each tracks as track, i}
                            {#if i !== selectedTrackIndex}
                                <input type="hidden" name="tex-{i}" value={track.tex}/>
                            {/if}
                        {/each}
                    </div>
                {/if}
            </div>

            <div class="editor-right">
                {#if viewMode !== 'tex' && viewMode !== 'full-tex'}
                    <div class="preview-editor">
                        <div class="preview-header">
                            <span>プレビュー</span>
                        </div>
                        <div class="preview-container">
                            <AlphaTabPlayer tex={validatedTex} tracks={visibleTrackIndices}/>
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        <FormCard class="public-settings-section">
            <h3>公開設定</h3>
            <FormGroup label="texの公開" id="texPublicSetting" row>
                <select id="texPublicSetting" name="texPublicSetting" bind:value={texPublicSetting} disabled={readonly}>
                    <option value="private">非公開</option>
                    <option value="login">ログイン済みユーザーにのみ公開</option>
                    <option value="public">公開</option>
                </select>
                {#if readonly}
                    <input type="hidden" name="texPublicSetting" value={texPublicSetting}/>
                {/if}
            </FormGroup>

            <FormGroup label="バージョン履歴の公開" id="historyPublicSetting" row>
                <select id="historyPublicSetting" name="historyPublicSetting" bind:value={historyPublicSetting} disabled={readonly}>
                    <option value="private">非公開</option>
                    <option value="login">ログイン済みユーザーにのみ公開</option>
                    <option value="public">公開</option>
                </select>
                {#if readonly}
                    <input type="hidden" name="historyPublicSetting" value={historyPublicSetting}/>
                {/if}
            </FormGroup>
        </FormCard>

        <FormCard class="version-section">
            <h3>バージョン</h3>
            <FormGroup label="バージョン" id="version" row>
                <input type="text" id="version" name="version" placeholder="自動生成" value={readonly ? data.history?.version : ''}
                       {readonly}/>
            </FormGroup>
            <FormGroup label="内容" id="versionComment" row>
                <input type="text" id="versionComment" name="versionComment" bind:value={versionComment} required
                       placeholder={isEdit ? "編集内容を入力してください" : "新規登録"} {readonly}/>
            </FormGroup>
        </FormCard>

        <div class="form-actions">
            {#if readonly}
                <Button href="/tabs/{data.tab._id}/versions" variant="secondary">キャンセル</Button>
            {:else}
                <Button href="/tabs" variant="secondary">キャンセル</Button>
                {#if hasErrors}
                    <Button type="button" variant="danger-outline" onclick={() => viewMode = 'full-tex'}>エラーを確認</Button>
                {:else}
                    <Button type="submit" variant="primary">{isEdit ? '更新する' : '登録する'}</Button>
                {/if}
            {/if}
        </div>
    </form>
</div>

<style>
    .tabs-editor-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .list-header h1 {
        margin: 0;
        font-size: 1.75rem;
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

    .editor-main.full-tex-only {
        grid-template-columns: 1fr;
    }

    .editor-main.tex-only {
        grid-template-columns: 1fr;
    }

    .editor-main.preview-only {
        grid-template-columns: 1fr;
    }

    .editor-main.full-tex-only .editor-left,
    .editor-main.full-tex-only .editor-right {
        display: none;
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
        height: 700px;
    }

    .tex-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background: #f8f9fa;
        border-bottom: 1px solid #dee2e6;
        font-weight: bold;
        font-size: 0.9rem;
    }

    .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .track-select {
        padding: 2px 8px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        background: #fff;
        font-size: 0.9rem;
        font-weight: bold;
        color: #333;
        cursor: pointer;
    }

    .error-count-badge {
        background: #dc3545;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
    }

    .track-error-list {
        max-height: 150px;
        overflow-y: auto;
        border-bottom: 1px solid #dee2e6;
        background: #fff5f5;
    }

    .track-error-item {
        display: flex;
        width: 100%;
        gap: 10px;
        padding: 6px 12px;
        font-size: 0.85rem;
        text-align: left;
        border: none;
        border-bottom: 1px solid #fee2e2;
        background: transparent;
        cursor: pointer;
        color: #333;
    }

    .track-error-item:hover {
        background: #fecaca;
    }

    .track-error-item.warning {
        background: #fffbeb;
        border-bottom: 1px solid #fef3c7;
    }

    .track-error-item.warning:hover {
        background: #fef3c7;
    }

    .error-pos {
        font-weight: bold;
        color: #dc3545;
        white-space: nowrap;
    }

    .track-error-item.warning .error-pos {
        color: #d97706;
    }

    .error-msg {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .code-editor-container {
        flex: 1;
        overflow: hidden;
        min-height: 0;
    }

    :global(.cm-editor) {
        height: 100%;
    }

    .preview-editor {
        display: flex;
        flex-direction: column;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        height: 700px;
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
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .full-tex-editor {
        display: flex;
        flex-direction: column;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        height: 700px;
    }

    .version-section,
    .public-settings-section {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .version-section h3,
    .public-settings-section h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #333;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }

    .form-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1.5rem;
    }

    .btn-error {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        min-width: 140px;
    }

    .btn-error:hover {
        background-color: #c82333;
    }

    @media (max-width: 768px) {
        .tabs-editor-container {
            padding: 10px;
        }
        .list-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        .form-group.row label.track-label {
            width: 100%;
            justify-content: flex-start;
        }
        .track-inputs {
            grid-template-columns: 1fr;
        }
        .editor-main {
            grid-template-columns: 1fr;
        }
        .tex-editor, .preview-editor, .full-tex-editor {
            height: 500px;
        }
        .editor-left, .editor-right {
            width: 100%;
        }
        .form-actions {
            flex-direction: column;
            align-items: stretch;
        }
        .form-actions :global(.btn-secondary), .form-actions :global(.btn-primary), .form-actions :global(.btn-danger-outline) {
            width: 100% !important;
        }
    }
</style>
