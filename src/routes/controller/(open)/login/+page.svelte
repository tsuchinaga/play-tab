<script lang="ts">
    let { form } = $props();

    let errorElement = $state<HTMLElement | null>(null);
    $effect(() => {
        if (form?.error && errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
</script>

<svelte:head>
	<title>管理者ログイン | Play Tab Admin</title>
</svelte:head>

<div class="admin-form-container">
    <h1>管理者ログイン</h1>

    {#if form?.error}
        <p class="admin-error-message" bind:this={errorElement}>{form.error}</p>
    {/if}

    <form method="POST">
        <div class="admin-form-group">
            <label for="loginId">ログインID</label>
            <input type="text" id="loginId" name="loginId" required value={form?.loginId ?? ''} />
        </div>
        <div class="admin-form-group">
            <label for="password">パスワード</label>
            <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" class="btn-admin">ログイン</button>
    </form>
</div>
