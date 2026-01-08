<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import FormCard from '$lib/components/common/FormCard.svelte';
    let { data, form } = $props();
    let announcement = data.announcement;
</script>

<svelte:head>
    <title>お知らせ編集 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>お知らせ編集</h1>
    </div>

    {#if form?.message}
        <p class="error-message">{form.message}</p>
    {/if}

    <form method="POST" use:enhance>
        <FormCard>
            <FormGroup label="タイトル" id="title" row>
                <input type="text" id="title" name="title" value={form?.title ?? announcement.title} required />
            </FormGroup>
            <FormGroup label="内容" id="content" row>
                <textarea id="content" name="content" rows="10" required>{form?.content ?? announcement.content}</textarea>
            </FormGroup>
        </FormCard>
        
        <div class="form-actions">
            <Button href="/controller/announcements" variant="secondary">キャンセル</Button>
            <Button type="submit" variant="primary">更新</Button>
        </div>
    </form>
</div>

<style>
</style>
