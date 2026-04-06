<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    let { form } = $props();

    let errorElement = $state<HTMLElement | null>(null);
    $effect(() => {
        if (form?.error && errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
</script>

<svelte:head>
    <title>パスワード再発行 | Play Tab</title>
</svelte:head>

<div class="form-container">
    <h1>パスワード再発行</h1>

    {#if form?.success}
        <p class="success-message">パスワード再設定用のリンクをメールで送信しました。<br>メールをご確認ください。</p>
        <div class="form-actions">
            <Button variant="secondary" href="/login">ログイン画面に戻る</Button>
        </div>
    {:else}
        <p>登録されているメールアドレスとユーザーIDを入力してください。<br>パスワード再設定用のリンクを送信します。</p>

        {#if form?.error}
            <p class="error-message" bind:this={errorElement}>{form.error}</p>
        {/if}

        <form method="POST" use:enhance>
            <FormGroup label="ユーザーID" id="loginId">
                <input type="text" id="loginId" name="loginId" required value={form?.loginId ?? ''} />
            </FormGroup>
            <FormGroup label="メールアドレス" id="email">
                <input type="email" id="email" name="email" required value={form?.email ?? ''} />
            </FormGroup>
            <div class="form-actions">
                <Button type="submit" variant="primary">送信</Button>
                <Button variant="secondary" href="/login">キャンセル</Button>
            </div>
        </form>
    {/if}
</div>

<style>
    .success-message {
        background-color: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        border: 1px solid #c3e6cb;
    }
</style>
