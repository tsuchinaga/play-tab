<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';

    export let data: PageData;
    export let form: ActionData;

    let errorElement: HTMLElement;
    $: if (form?.error && errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
            <div class="form-card">
                <div class="form-group row">
                    <label for="username">ユーザー名</label>
                    <div class="input-container">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={form?.username ?? data.user.username}
                            required
                        />
                    </div>
                </div>

                <div class="form-group row">
                    <label for="email">メールアドレス</label>
                    <div class="input-container">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form?.email ?? data.user.email}
                            required
                        />
                    </div>
                </div>

                <div class="form-group row">
                    <label for="password">パスワード</label>
                    <div class="input-container">
                        <input type="password" id="password" name="password" placeholder="変更する場合のみ入力" />
                    </div>
                </div>

                <div class="form-group row">
                    <label for="confirmPassword">確認用パスワード</label>
                    <div class="input-container">
                        <input type="password" id="confirmPassword" name="confirmPassword" />
                    </div>
                </div>

                <div class="form-group row">
                    <label for="registeredTabsVisibility">更新したTAB譜の公開</label>
                    <div class="input-container">
                        <select id="registeredTabsVisibility" name="registeredTabsVisibility">
                            <option value="private" selected={data.user.registeredTabsVisibility === 'private'}>非公開</option>
                            <option value="logged_in" selected={data.user.registeredTabsVisibility === 'logged_in'}>ログイン済みユーザーにのみ公開</option>
                            <option value="public" selected={data.user.registeredTabsVisibility === 'public'}>公開</option>
                        </select>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="favoritedTabsVisibility">お気に入りしたTAB譜の公開</label>
                    <div class="input-container">
                        <select id="favoritedTabsVisibility" name="favoritedTabsVisibility">
                            <option value="private" selected={data.user.favoritedTabsVisibility === 'private'}>非公開</option>
                            <option value="logged_in" selected={data.user.favoritedTabsVisibility === 'logged_in'}>ログイン済みユーザーにのみ公開</option>
                            <option value="public" selected={data.user.favoritedTabsVisibility === 'public'}>公開</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-actions">
                <a href="/user" class="btn-secondary">キャンセル</a>
                <button type="submit" class="btn-primary form-submit">保存する</button>
            </div>
        </form>
    </div>
</div>

<style>
    .form-actions {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 20px;
    }
</style>
