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
    <title>パスワード再設定 | Play Tab</title>
</svelte:head>

<div class="form-container">
    <h1>パスワード再設定</h1>

    {#if data.error}
        <p class="error-message">{data.error}</p>
        <div class="form-actions">
            <Button variant="secondary" href="/forgot-password">再発行リクエストに戻る</Button>
        </div>
    {:else}
        <p>新しいパスワードを入力してください。</p>

        {#if form?.error}
            <p class="error-message" bind:this={errorElement}>{form.error}</p>
        {/if}

        <form method="POST" use:enhance>
            <FormGroup label="新しいパスワード" id="password">
                <input type="password" id="password" name="password" required minlength="8" />
            </FormGroup>
            <FormGroup label="パスワード（確認）" id="passwordConfirm">
                <input type="password" id="passwordConfirm" name="passwordConfirm" required minlength="8" />
            </FormGroup>
            <div class="form-actions">
                <Button type="submit" variant="primary">更新</Button>
                <Button variant="secondary" href="/login">キャンセル</Button>
            </div>
        </form>
    {/if}
</div>

