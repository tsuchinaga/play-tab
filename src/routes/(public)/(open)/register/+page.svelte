<script lang="ts">
    import { enhance } from '$app/forms';
    let { form } = $props();
</script>

<h1>新規登録</h1>

{#if form?.error}
    <p style="color: red;">{form.error}</p>
{/if}

<form method="POST" use:enhance>
    <div>
        <label for="loginId">ログインID</label>
        <input type="text" id="loginId" name="loginId" required value={form?.loginId ?? ''} />
    </div>
    <div>
        <label for="username">ユーザー名</label>
        <input type="text" id="username" name="username" required value={form?.username ?? ''} />
    </div>
    <div>
        <label for="password">パスワード</label>
        <input type="password" id="password" name="password" required />
    </div>
    <div>
        <label for="confirmPassword">確認用パスワード</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required />
    </div>
    <button type="submit">登録</button>
</form>

<a href="/login">ログインページへ戻る</a>
