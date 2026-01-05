<script lang="ts">
    let { data, form } = $props();
</script>

<svelte:head>
    <title>管理者編集 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>管理者編集</h1>
    </div>

    {#if form?.message}
        <div class="admin-error-message">{form.message}</div>
    {/if}

    <form method="POST" action="?/update">
        <div class="form-card">
            <div class="form-group row">
                <label for="loginId">ログインID</label>
                <div class="input-container">
                    <input type="text" id="loginId" value={data.targetAdmin.loginId} disabled />
                </div>
            </div>
            <div class="form-group row">
                <label for="password">新しいパスワード</label>
                <div class="input-container">
                    <input type="password" id="password" name="password" placeholder="変更する場合のみ入力" />
                </div>
            </div>
            <div class="form-group row">
                <label for="confirmPassword">新しいパスワード（確認）</label>
                <div class="input-container">
                    <input type="password" id="confirmPassword" name="confirmPassword" />
                </div>
            </div>
        </div>
        
        <div class="form-actions">
            <a href="/controller/administrators" class="btn-admin-secondary">キャンセル</a>
            <button type="submit" class="btn-admin form-submit">更新</button>
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
