<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import * as alphaTab from '@coderline/alphatab';

    interface Props {
        tex?: string;
        tracks?: number[] | 'all';
        api?: alphaTab.AlphaTabApi | null;
    }

    let { tex = '', tracks = 'all', api = $bindable(null) } = $props<Props>();

    let element: HTMLElement;
    let scrollElement: HTMLElement;

    onMount(() => {
        const settings: alphaTab.SettingsJson = {
            core: { fontDirectory: "/font/" },
            player: {
                playerMode: alphaTab.PlayerMode.EnabledAutomatic,
                enableCursor: true,
                soundFont: "/soundfont/sonivox.sf2",
                scrollElement: scrollElement
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

<div class="alphatab-container" bind:this={scrollElement}>
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
