<script lang="ts">
    import type { PageData } from './$types';

    let { data } = $props();
    const { profileUser, publicTabCount } = data;

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        const y = d.getFullYear();
        const m = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${y}年${m}月${day}日`;
    };
</script>

<svelte:head>
    <title>{profileUser.username} のプロフィール | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>ユーザープロフィール</h1>
    </div>

    <div class="form-card">
        <div class="profile-item">
            <span class="label">ユーザー名</span>
            <span class="value">{profileUser.username}</span>
        </div>
        <div class="profile-item">
            <span class="label">登録日</span>
            <span class="value">{formatDate(profileUser.createdAt)}</span>
        </div>
        <div class="profile-item">
            <span class="label">公開TAB譜の数</span>
            <span class="value">{publicTabCount}</span>
        </div>
    </div>
</div>

<style>
    .profile-item {
        display: flex;
        padding: 1rem 0;
        border-bottom: 1px solid #dee2e6;
    }

    .profile-item:last-child {
        border-bottom: none;
    }

    .label {
        width: 120px;
        font-weight: bold;
        color: #495057;
    }

    .value {
        color: #212529;
    }
</style>
