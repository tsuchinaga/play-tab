<script lang="ts">
	import { page } from '$app/stores';

	let status = $derived($page.status);
	let message = $derived($page.error?.message);

	function goBack() {
		history.back();
	}
</script>

<svelte:head>
	<title>{status} Error - Play Tab</title>
</svelte:head>

<div class="error-wrapper">
	<div class="error-container">
		<div class="error-content">
			<h1>{status}</h1>
			
			{#if status === 404}
				<p>お探しのページは見つかりませんでした。</p>
				<p class="detail">URLが正しいかご確認ください。</p>
			{:else if status === 500}
				<p>サーバーでエラーが発生しました。</p>
				<p class="detail">ご不便をおかけして申し訳ありません。しばらく待ってから再度お試しください。</p>
			{:else if status === 403}
				<p>アクセス権限がありません。</p>
			{:else}
				<p>予期せぬエラーが発生しました。</p>
				{#if message}
					<p class="detail">{message}</p>
				{/if}
			{/if}

			<div class="error-actions">
				{#if status === 404}
					<button class="btn-primary" onclick={goBack}>前のページに戻る</button>
				{:else}
					<a href="/" class="btn-primary">ホームに戻る</a>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.error-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background-color: #f8f9fa;
		font-family: sans-serif;
	}

	.error-container {
		max-width: 400px;
		width: 90%;
		background: white;
		border: 1px solid #dee2e6;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.error-content {
		text-align: center;
		padding: 40px 20px;
	}

	h1 {
		font-size: 3rem;
		color: #333;
		margin: 0 0 1rem 0;
	}

	p {
		font-size: 1.1rem;
		margin: 0.5rem 0;
		color: #333;
	}

	.detail {
		color: #6c757d;
		font-size: 0.9rem;
	}

	.error-actions {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 140px;
		height: 38px;
		background-color: #007bff;
		color: white;
		text-decoration: none;
		border: none;
		border-radius: 4px;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.btn-primary:hover {
		background-color: #0069d9;
		color: white;
	}
</style>
