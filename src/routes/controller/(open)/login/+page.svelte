<script lang="ts">
    let { form } = $props();
</script>

<div class="admin-form-container">
    <h1>管理者ログイン</h1>

    {#if form?.error}
        <p class="admin-error-message">{form.error}</p>
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
