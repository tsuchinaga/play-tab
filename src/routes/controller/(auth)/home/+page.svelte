<script lang="ts">
    let { data } = $props();
</script>

<h1>管理者ホーム</h1>
<p>ようこそ、{data.admin?.loginId}さん</p>

<form method="POST" action="/controller/logout">
    <button type="submit">ログアウト</button>
</form>

<a href="/controller/login">ログインページへ（動作確認用）</a>
