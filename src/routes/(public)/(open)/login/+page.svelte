<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    let { data, form } = $props();

    let errorElement = $state<HTMLElement | null>(null);
    $effect(() => {
        if (form?.error && errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
</script>

<svelte:head>
	<title>ログイン | Play Tab</title>
</svelte:head>

<div class="form-container">
    <h1>ログイン</h1>

    {#if data.message}
        <p class="success-message">{data.message}</p>
    {/if}

    {#if form?.error}
        <p class="error-message" bind:this={errorElement}>{form.error}</p>
    {/if}

    <form method="POST" use:enhance>
        <FormGroup label="ログインID" id="loginId">
            <input type="text" id="loginId" name="loginId" required value={form?.loginId ?? ''} />
        </FormGroup>
        <FormGroup label="パスワード" id="password">
            <input type="password" id="password" name="password" required />
        </FormGroup>
        <div class="form-actions">
            <Button type="submit" variant="primary">ログイン</Button>
        </div>
    </form>

    <div class="form-footer">
        <a href="/forgot-password">パスワードを忘れた方はこちら</a><br>
        <a href="/register">新規登録はこちら</a>
    </div>
</div>
