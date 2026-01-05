<script lang="ts">
    let { form } = $props();
</script>

<svelte:head>
    <title>管理者登録 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>管理者登録</h1>
    </div>

    {#if form?.message}
        <div class="admin-error-message">{form.message}</div>
    {/if}

    <form method="POST">
        <div class="form-card">
            <div class="form-group row">
                <label for="loginId">ログインID</label>
                <div class="input-container">
                    <input type="text" id="loginId" name="loginId" value={form?.loginId ?? ''} required />
                </div>
            </div>
            <div class="form-group row">
                <label for="password">パスワード</label>
                <div class="input-container">
                    <input type="password" id="password" name="password" required />
                </div>
            </div>
            <div class="form-group row">
                <label for="confirmPassword">パスワード（確認）</label>
                <div class="input-container">
                    <input type="password" id="confirmPassword" name="confirmPassword" required />
                </div>
            </div>
        </div>
        
        <div class="form-actions">
            <button type="submit" class="btn-admin form-submit">登録</button>
            <a href="/controller/administrators" class="btn-admin-secondary">キャンセル</a>
        </div>
    </form>
</div>

<style>
    .form-actions {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
    }
</style>
