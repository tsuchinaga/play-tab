<script lang="ts">
    import type { PageData } from './$types';

    let { data } = $props();
    const { user, publicTabCount, favoriteCount } = data;

    const formatDate = (date: Date | string) => {
        if (!date) return '';
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
            <span class="label">メールアドレス</span>
            <span class="value">{user.email}</span>
        </div>
        <div class="profile-item">
            <span class="label">登録日</span>
            <span class="value">{formatDate(user.createdAt)}</span>
        </div>
        <div class="profile-item">
            <span class="label">公開TAB譜数</span>
            <span class="value">{publicTabCount}</span>
        </div>
        <div class="profile-item">
            <span class="label">お気に入り数</span>
            <span class="value">{favoriteCount}</span>
        </div>
    </div>

    {#if data.registeredTabs.length > 0}
        <section style="margin-top: 40px;">
            <div class="list-header">
                <h1>最近更新したTAB譜</h1>
            </div>
            <div class="table-wrapper">
                <table class="list-table">
                    <thead>
                        <tr>
                            <th>曲名</th>
                            <th>楽器</th>
                            <th>更新日</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data.registeredTabs as tab}
                            <tr>
                                <td><a href="/tab/{tab._id}">{tab.name}</a></td>
                                <td>{tab.instruments.join(', ')}</td>
                                <td>{formatDate(tab.updatedAt)}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </section>
    {/if}

    {#if data.favoriteTabs.length > 0}
        <section style="margin-top: 40px;">
            <div class="list-header">
                <h1>最近お気に入り登録したTAB譜</h1>
            </div>
            <div class="table-wrapper">
                <table class="list-table">
                    <thead>
                        <tr>
                            <th>曲名</th>
                            <th>投稿者</th>
                            <th>楽器</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each data.favoriteTabs as f}
                            <tr>
                                <td><a href="/tab/{f._id}">{f.name}</a></td>
                                <td><a href="/user/{f.creator._id}">{f.creator.username}</a></td>
                                <td>{f.instruments.join(', ')}</td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </section>
    {/if}
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
