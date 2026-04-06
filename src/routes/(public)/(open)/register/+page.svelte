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
	<title>新規登録 | Play Tab</title>
</svelte:head>

<div class="form-container">
    <h1>新規登録</h1>

    {#if form?.error}
        <p class="error-message" bind:this={errorElement}>{form.error}</p>
    {/if}

    <form method="POST" use:enhance>
        {#if form?.success}
            <div class="success-message">
                <p>登録を受け付けました。入力されたメールアドレスに確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。</p>
            </div>
        {:else}
            <FormGroup label="ログインID" id="loginId">
            <input type="text" id="loginId" name="loginId" required value={form?.loginId ?? ''} />
        </FormGroup>
        <FormGroup label="ユーザー名" id="username">
            <input type="text" id="username" name="username" required value={form?.username ?? ''} />
        </FormGroup>
        <FormGroup label="メールアドレス" id="email">
            <input type="email" id="email" name="email" required value={form?.email ?? ''} />
        </FormGroup>
        <FormGroup label="パスワード" id="password">
            <input type="password" id="password" name="password" required />
        </FormGroup>
        <FormGroup label="確認用パスワード" id="confirmPassword">
            <input type="password" id="confirmPassword" name="confirmPassword" required />
        </FormGroup>
        <div class="form-actions">
            <Button type="submit" variant="primary">登録</Button>
        </div>
        {/if}
    </form>

    <div class="form-footer">
        <a href="/login">ログインページへ戻る</a>
    </div>
</div>
