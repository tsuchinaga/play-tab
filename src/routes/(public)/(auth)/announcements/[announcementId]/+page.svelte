<script lang="ts">
	import Button from '$lib/components/common/Button.svelte';
	import FormCard from '$lib/components/common/FormCard.svelte';
	let { data } = $props();
	const announcement = $derived(data.announcement);
</script>

<svelte:head>
	<title>{announcement.title} | Play Tab</title>
</svelte:head>

<div class="list-container">
	<div class="list-header">
		<h1>お知らせ詳細</h1>
	</div>

	<FormCard>
		<div class="announcement-detail-header">
			<h2 class="title">{announcement.title}</h2>
			<div class="meta">
				<span class="date">公開日: {new Date(announcement.createdAt).toLocaleDateString()}</span>
			</div>
		</div>
		<hr />
		<div class="content">
			{announcement.content}
		</div>
	</FormCard>

	<div class="form-actions" style="margin-top: 2rem;">
		<Button href="/announcements" variant="secondary">一覧へ戻る</Button>
	</div>
</div>

<style>
	.announcement-detail-header {
		margin-bottom: 1rem;
	}

	.title {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		color: #333;
	}

	.meta {
		color: #6c757d;
		font-size: 0.9rem;
	}

	hr {
		border: 0;
		border-top: 1px solid #dee2e6;
		margin: 1rem 0;
	}

	.content {
		white-space: pre-wrap;
		line-height: 1.6;
		color: #333;
	}
</style>
