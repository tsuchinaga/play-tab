<script lang="ts">
    import { enhance } from '$app/forms';
    import TabEditor from '$lib/components/TabEditor.svelte';

    let { data, form } = $props();
</script>

<svelte:head>
    <title>TAB譜編集 | Play Tab</title>
</svelte:head>

<div use:enhance>
    <TabEditor {data} {form} isEdit={true} />
</div>
