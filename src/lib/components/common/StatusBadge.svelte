<script lang="ts">
	interface Props {
		status: 'public' | 'private' | 'draft' | string;
		label?: string;
	}

	let { status, label }: Props = $props();

	const statusClass = $derived(`status-badge status-${status}`);
	const displayLabel = $derived(label || (status === 'public' ? '公開' : status === 'private' ? '非公開' : status === 'draft' ? '下書き' : status === 'unlisted' ? '限定公開' : status));
</script>

<span class={statusClass}>
	{displayLabel}
</span>
