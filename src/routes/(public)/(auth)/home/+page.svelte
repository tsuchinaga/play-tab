<script lang="ts">
    let { data } = $props();
</script>

<h1>ホーム</h1>
<p>ようこそ、{data.user?.username}さん</p>

<form method="POST" action="/logout">
    <button type="submit">ログアウト</button>
</form>

<a href="/login">ログインページへ（動作確認用）</a>
