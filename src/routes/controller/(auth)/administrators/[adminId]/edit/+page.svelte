<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import FormCard from '$lib/components/common/FormCard.svelte';
    let { data, form } = $props();
</script>

<svelte:head>
    <title>管理者編集 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>管理者編集</h1>
    </div>

    {#if form?.message}
        <p class="error-message">{form.message}</p>
    {/if}

    <form method="POST" action="?/update" use:enhance>
        <FormCard>
            <FormGroup label="ログインID" id="loginId" row>
                <input type="text" id="loginId" value={data.targetAdmin.loginId} disabled />
            </FormGroup>
            <FormGroup label="メールアドレス" id="email" row>
                <input type="email" id="email" name="email" value={form?.email ?? data.targetAdmin.email} required />
            </FormGroup>
            <FormGroup label="新しいパスワード" id="password" row>
                <input type="password" id="password" name="password" placeholder="変更する場合のみ入力" />
            </FormGroup>
            <FormGroup label="新しいパスワード（確認）" id="confirmPassword" row>
                <input type="password" id="confirmPassword" name="confirmPassword" />
            </FormGroup>
        </FormCard>
        
        <div class="form-actions">
            <Button href="/controller/administrators" variant="secondary">キャンセル</Button>
            <Button type="submit" variant="primary">更新</Button>
        </div>
    </form>
</div>

<style>
</style>
