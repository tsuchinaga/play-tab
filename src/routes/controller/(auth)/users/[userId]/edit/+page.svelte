<script lang="ts">
    let { data, form } = $props();
</script>

<svelte:head>
    <title>ユーザー編集 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>ユーザー編集</h1>
    </div>

    {#if form?.message}
        <div class="admin-error-message">{form.message}</div>
    {/if}

    <form method="POST">
        <div class="form-card">
            <div class="form-group row">
                <label for="loginId">ログインID</label>
                <div class="input-container">
                    <input type="text" id="loginId" value={data.targetUser.loginId} readonly />
                </div>
            </div>
            <div class="form-group row">
                <label for="username">ユーザー名</label>
                <div class="input-container">
                    <input type="text" id="username" value={data.targetUser.username} readonly />
                </div>
            </div>
            <div class="form-group row">
                <label for="email">メールアドレス</label>
                <div class="input-container">
                    <input type="email" id="email" value={data.targetUser.email} readonly />
                </div>
            </div>
            <div class="form-group row">
                <label for="isActive">ログイン有効</label>
                <div class="input-container">
                    <select id="isActive" name="isActive">
                        <option value="true" selected={data.targetUser.isActive}>有効</option>
                        <option value="false" selected={!data.targetUser.isActive}>無効</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="form-actions">
            <button type="submit" class="btn-admin form-submit">更新</button>
            <a href="/controller/users" class="btn-admin-secondary">キャンセル</a>
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
