<script lang="ts">
    import { enhance } from '$app/forms';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    let { data, form } = $props();
</script>

<svelte:head>
	<title>メール確認 | Play Tab</title>
</svelte:head>

<div class="form-container">
    <h1>メール確認</h1>

    {#if form?.success}
        <p>メールアドレスの確認が完了しました。</p>
        <div class="form-actions">
            <a href="/login" class="btn-primary" style="display: flex; align-items: center; justify-content: center; text-decoration: none;">ログインする</a>
        </div>
    {:else if data.error}
        <p class="error-message">{data.error}</p>
        <div class="form-footer">
            <a href="/login">ログインページへ戻る</a>
        </div>
    {:else}
        {#if form?.error}
            <p class="error-message">{form.error}</p>
        {/if}
        <p>メールに記載された6桁の認証コードを入力してください。</p>
        <form method="POST" use:enhance>
            <FormGroup label="認証コード" id="code">
                <input type="text" id="code" name="code" required maxlength="6" pattern="[0-9]{'{'}6{'}'}" placeholder="123456" />
            </FormGroup>
            <div class="form-actions">
                <button type="submit" class="btn-primary">確認</button>
            </div>
        </form>
    {/if}
</div>
