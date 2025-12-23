<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props();
</script>

<div class="form-container">
    <h1>ログイン</h1>

    {#if form?.error}
        <p class="error-message">{form.error}</p>
    {/if}

    <form method="POST" use:enhance>
        <div class="form-group">
            <label for="loginId">ログインID</label>
            <input type="text" id="loginId" name="loginId" required value={form?.loginId ?? ''} />
        </div>
        <div class="form-group">
            <label for="password">パスワード</label>
            <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" class="btn-primary">ログイン</button>
    </form>

    <div class="form-footer">
        <a href="/register">新規登録はこちら</a>
    </div>
</div>
