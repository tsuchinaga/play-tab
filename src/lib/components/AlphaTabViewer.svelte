<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import * as alphaTab from '@coderline/alphatab';

    interface Props {
        tex?: string;
        tracks?: number[] | 'all';
    }

    let { tex = '', tracks = 'all' } = $props<Props>();

    let element: HTMLElement;
    let api: alphaTab.AlphaTabApi | null = null;

    onMount(() => {
        const settings: alphaTab.SettingsJson = {
            core: { fontDirectory: "/font/" },
            player: {
                scrollMode: 'off',
                scrollElement: element
            }
        };

        api = new alphaTab.AlphaTabApi(element, settings);
        if (tex) {
            api.tex(tex, tracks);
        }
    });

    $effect(() => {
        if (api && tex) {
            api.tex(tex, tracks);
        }
    });

    onDestroy(() => {
        if (api) {
            api.destroy();
        }
    });
</script>

<div class="alphatab-container">
    <div bind:this={element}></div>
</div>

<style>
    .alphatab-container {
        width: 100%;
        height: 100%;
        overflow: auto;
        background: #fff;
        border: 1px solid #dee2e6;
        border-radius: 4px;
    }
</style>
