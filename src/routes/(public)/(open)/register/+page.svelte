<script lang="ts">
    import { enhance } from '$app/forms';
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
        <div class="form-group">
            <label for="loginId">ログインID</label>
            <input type="text" id="loginId" name="loginId" required value={form?.loginId ?? ''} />
        </div>
        <div class="form-group">
            <label for="username">ユーザー名</label>
            <input type="text" id="username" name="username" required value={form?.username ?? ''} />
        </div>
        <div class="form-group">
            <label for="password">パスワード</label>
            <input type="password" id="password" name="password" required />
        </div>
        <div class="form-group">
            <label for="confirmPassword">確認用パスワード</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required />
        </div>
        <button type="submit" class="btn-primary">登録</button>
    </form>

    <div class="form-footer">
        <a href="/login">ログインページへ戻る</a>
    </div>
</div>
