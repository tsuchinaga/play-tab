<script lang="ts">
    import TabEditor from '$lib/components/TabEditor.svelte';
    let { data } = $props();
</script>

<svelte:head>
    <title>{data.tab.name}の履歴表示 (Ver.{data.history.version}) | Play Tab</title>
</svelte:head>

<TabEditor {data} readonly={true} />
