<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import FormCard from '$lib/components/common/FormCard.svelte';
    let { data, form } = $props();
</script>

<svelte:head>
    <title>ユーザー編集 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>ユーザー編集</h1>
    </div>

    {#if form?.message}
        <p class="error-message">{form.message}</p>
    {/if}

    <form method="POST" use:enhance>
        <FormCard>
            <FormGroup label="ログインID" id="loginId" row>
                <input type="text" id="loginId" value={data.targetUser.loginId} readonly />
            </FormGroup>
            <FormGroup label="ユーザー名" id="username" row>
                <input type="text" id="username" value={data.targetUser.username} readonly />
            </FormGroup>
            <FormGroup label="メールアドレス" id="email" row>
                <input type="email" id="email" value={data.targetUser.email} readonly />
            </FormGroup>
            <FormGroup label="ログイン有効" id="isActive" row>
                <select id="isActive" name="isActive">
                    <option value="true" selected={data.targetUser.isActive}>有効</option>
                    <option value="false" selected={!data.targetUser.isActive}>無効</option>
                </select>
            </FormGroup>
        </FormCard>
        
        <div class="form-actions">
            <Button href="/controller/users" variant="secondary">キャンセル</Button>
            <Button type="submit" variant="primary">更新</Button>
        </div>
    </form>
</div>

<style>
</style>
