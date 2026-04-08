<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import FormCard from '$lib/components/common/FormCard.svelte';
    let { form } = $props();
</script>

<svelte:head>
    <title>管理者登録 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>管理者登録</h1>
    </div>

    {#if form?.message}
        <p class="error-message">{form.message}</p>
    {/if}

    <form method="POST" use:enhance>
        <FormCard>
            <FormGroup label="ログインID" id="loginId" row>
                <input type="text" id="loginId" name="loginId" value={form?.loginId ?? ''} required />
            </FormGroup>
            <FormGroup label="メールアドレス" id="email" row>
                <input type="email" id="email" name="email" value={form?.email ?? ''} required />
            </FormGroup>
            <FormGroup label="パスワード" id="password" row>
                <input type="password" id="password" name="password" required />
            </FormGroup>
            <FormGroup label="パスワード（確認）" id="confirmPassword" row>
                <input type="password" id="confirmPassword" name="confirmPassword" required />
            </FormGroup>
        </FormCard>
        
        <div class="form-actions">
            <Button href="/controller/administrators" variant="secondary">キャンセル</Button>
            <Button type="submit" variant="primary">登録</Button>
        </div>
    </form>
</div>

<style>
</style>
