<script lang="ts">
    import { enhance } from '$app/forms';
    import Button from '$lib/components/common/Button.svelte';
    import FormGroup from '$lib/components/common/FormGroup.svelte';
    import FormCard from '$lib/components/common/FormCard.svelte';
    import type { PageData, ActionData } from './$types';

    let { data, form }: { data: PageData, form: ActionData } = $props();

    let errorElement = $state<HTMLElement | null>(null);
    $effect(() => {
        if (form?.error && errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
</script>

<svelte:head>
    <title>プロフィール編集 | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>プロフィール編集</h1>
    </div>

    <div class="form-wrapper">
        {#if form?.error}
            <p class="error-message" bind:this={errorElement}>{form.error}</p>
        {/if}

        <form method="POST" use:enhance>
            <FormCard>
                <FormGroup label="ユーザー名" id="username" row>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={form?.username ?? data.user.username}
                        required
                    />
                </FormGroup>

                <FormGroup label="メールアドレス" id="email" row>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={form?.email ?? data.user.email}
                        required
                    />
                </FormGroup>

                <FormGroup label="パスワード" id="password" row>
                    <input type="password" id="password" name="password" placeholder="変更する場合のみ入力" />
                </FormGroup>

                <FormGroup label="確認用パスワード" id="confirmPassword" row>
                    <input type="password" id="confirmPassword" name="confirmPassword" />
                </FormGroup>

                <FormGroup label="更新したTAB譜の公開" id="registeredTabsVisibility" row>
                    <select id="registeredTabsVisibility" name="registeredTabsVisibility">
                        <option value="private" selected={data.user.registeredTabsVisibility === 'private'}>非公開</option>
                        <option value="logged_in" selected={data.user.registeredTabsVisibility === 'logged_in'}>ログイン済みユーザーにのみ公開</option>
                        <option value="public" selected={data.user.registeredTabsVisibility === 'public'}>公開</option>
                    </select>
                </FormGroup>

                <FormGroup label="お気に入りしたTAB譜の公開" id="favoritedTabsVisibility" row>
                    <select id="favoritedTabsVisibility" name="favoritedTabsVisibility">
                        <option value="private" selected={data.user.favoritedTabsVisibility === 'private'}>非公開</option>
                        <option value="logged_in" selected={data.user.favoritedTabsVisibility === 'logged_in'}>ログイン済みユーザーにのみ公開</option>
                        <option value="public" selected={data.user.favoritedTabsVisibility === 'public'}>公開</option>
                    </select>
                </FormGroup>
            </FormCard>

            <div class="form-actions">
                <Button href="/user" variant="secondary">キャンセル</Button>
                <Button type="submit" variant="primary">保存する</Button>
            </div>
        </form>
    </div>
</div>

<style>
</style>
