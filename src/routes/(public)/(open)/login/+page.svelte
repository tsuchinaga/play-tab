<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props();
</script>

<h1>ログイン</h1>

{#if form?.error}
    <p style="color: red;">{form.error}</p>
{/if}

<form method="POST" use:enhance>
    <div>
        <label for="loginId">ログインID</label>
        <input type="text" id="loginId" name="loginId" required value={form?.loginId ?? ''} />
    </div>
    <div>
        <label for="password">パスワード</label>
        <input type="password" id="password" name="password" required />
    </div>
    <button type="submit">ログイン</button>
</form>

<a href="/register">新規登録はこちら</a>
