<script lang="ts">
    import { enhance } from '$app/forms';
    import TabEditor from '$lib/components/TabEditor.svelte';

    let { data, form } = $props();
</script>

<svelte:head>
    <title>TAB譜編集 | Play Tab</title>
</svelte:head>

<div>
    <TabEditor {data} {form} isEdit={true} />
</div>
