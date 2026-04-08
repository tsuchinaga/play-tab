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
	<title>2段階認証 | Play Tab Admin</title>
</svelte:head>

<div class="form-container">
    <h1>2段階認証</h1>
    <p>登録されたメールアドレスに送信された認証コードを入力してください。</p>

    {#if form?.error}
        <p class="error-message" bind:this={errorElement}>{form.error}</p>
    {/if}

    <form method="POST" use:enhance>
        <FormGroup label="認証コード" id="code">
            <input type="text" id="code" name="code" required maxlength="6" pattern="\d{String.raw`{6}`}" placeholder="123456" />
        </FormGroup>
        <div class="form-actions">
            <Button type="submit" variant="primary">認証する</Button>
        </div>
    </form>
</div>
