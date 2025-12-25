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
                scrollMode: 'on'
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
        background: #fff;
        overflow: auto;
        height: 600px;
        box-sizing: border-box;
    }
</style>
