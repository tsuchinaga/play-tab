<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;
    const { user, publicTabCount } = data;

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const y = d.getFullYear();
        const m = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${y}年${m}月${day}日`;
    };
</script>

<svelte:head>
    <title>プロフィール | Play Tab</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>プロフィール</h1>
        <a href="/user/edit" class="btn-primary add-button">プロフィール編集</a>
    </div>

    <div class="form-card">
        <div class="profile-item">
            <span class="label">ユーザー名</span>
            <span class="value">{user.username}</span>
        </div>
        <div class="profile-item">
            <span class="label">登録日</span>
            <span class="value">{formatDate(user.createdAt)}</span>
        </div>
        <div class="profile-item">
            <span class="label">TAB譜の数</span>
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

    .add-button {
        width: auto;
        padding: 0.5rem 1.5rem;
        text-decoration: none;
        text-align: center;
    }
</style>
