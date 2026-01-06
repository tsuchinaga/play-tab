<script lang="ts">
    let { data, form } = $props();
    let announcement = data.announcement;
</script>

<svelte:head>
    <title>お知らせ編集 | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>お知らせ編集</h1>
    </div>

    {#if form?.message}
        <div class="admin-error-message">{form.message}</div>
    {/if}

    <form method="POST">
        <div class="form-card">
            <div class="form-group row">
                <label for="title">タイトル</label>
                <div class="input-container">
                    <input type="text" id="title" name="title" value={form?.title ?? announcement.title} required />
                </div>
            </div>
            <div class="form-group row">
                <label for="content">内容</label>
                <div class="input-container">
                    <textarea id="content" name="content" rows="10" required>{form?.content ?? announcement.content}</textarea>
                </div>
            </div>
        </div>
        
        <div class="form-actions">
            <a href="/controller/announcements" class="btn-admin-secondary">キャンセル</a>
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
