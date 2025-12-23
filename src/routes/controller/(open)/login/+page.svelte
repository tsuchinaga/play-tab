<script lang="ts">
    let { form } = $props();
</script>

<h1>管理者ログイン</h1>

{#if form?.error}
    <p style="color: red;">{form.error}</p>
{/if}

<form method="POST">
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
