<script lang="ts">
    import { onMount } from 'svelte';
    import * as alphaTab from '@coderline/alphatab';

    let element: HTMLElement;
    let viewportEl: HTMLDivElement | null = null;
    let api: any;

    onMount(() => {
        const settings: alphaTab.SettingsJson = {
            core: { fontDirectory: "/font/" },
            // player: {
            //     enablePlayer: true,
            //     enableCursor: true,
            //     soundFont: "/soundfont/sonivox.sf2",
            //     scrollElement: viewportEl,
            // },
        };

        api = new alphaTab.AlphaTabApi(element, settings);
        api.tex(`\\title "Hello AlphaTab" . 1.1*4`)
    });
</script>

<svelte:head>
    <title>alphaTab Test</title>
</svelte:head>

<div class="container">
    <h1>alphaTab Test</h1>
    <div bind:this={element}></div>
</div>

<style>
    .container {
        padding: 20px;
    }
</style>
