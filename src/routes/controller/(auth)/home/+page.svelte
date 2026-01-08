<script lang="ts">
    let { data } = $props();
</script>

<svelte:head>
	<title>管理者ホーム | Play Tab Admin</title>
</svelte:head>

<div class="list-container">
    <div class="list-header">
        <h1>管理者ホーム</h1>
    </div>
    
    <div class="form-card">
        <p>ようこそ、{data.admin?.loginId}さん</p>
        
        <div style="margin-top: 1rem; display: flex; gap: 1rem;">
            <form method="POST" action="/controller/logout">
                <button type="submit" class="btn-outline">ログアウト</button>
            </form>
        </div>
    </div>
</div>
