<script lang="ts">
    import TabEditor from '$lib/components/TabEditor.svelte';

    let { data, form } = $props();
</script>

<svelte:head>
    <title>新規TAB譜登録 | Play Tab</title>
</svelte:head>

<div>
    <TabEditor {data} {form} isEdit={false} />
</div>
