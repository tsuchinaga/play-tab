<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		id: string;
		error?: string;
		children?: Snippet;
		row?: boolean;
	}

	let { label, id, error, children, row = false }: Props = $props();
</script>

<div class="form-group" class:row>
	<label for={id}>{label}</label>
	<div class="input-container">
		{@render children?.()}
		{#if error}
			<p class="error-text">{error}</p>
		{/if}
	</div>
</div>

<style>
	.error-text {
		color: #dc3545;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}
</style>
