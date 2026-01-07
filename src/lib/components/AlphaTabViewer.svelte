<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import type * as alphaTabType from '@coderline/alphatab';

    interface Props {
        tex?: string;
        tracks?: number[] | 'all';
        api?: alphaTabType.AlphaTabApi | null;
    }

    let { tex = '', tracks = 'all', api = $bindable(null) } = $props<Props>();

    let element: HTMLElement;
    let scrollElement: HTMLElement;
    let alphaTabLib: typeof alphaTabType | null = null;

    onMount(async () => {
        if (!browser) return;
        alphaTabLib = await import('@coderline/alphatab');

        const settings: alphaTabType.SettingsJson = {
            core: { fontDirectory: "/font/" },
            player: {
                playerMode: alphaTabLib.PlayerMode.EnabledAutomatic,
                enableCursor: true,
                soundFont: "/soundfont/sonivox.sf2",
                scrollElement: scrollElement
            }
        };

        api = new alphaTabLib.AlphaTabApi(element, settings);

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
        height: 100%;
        box-sizing: border-box;
    }
</style>
