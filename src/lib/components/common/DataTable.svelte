<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		headers: (string | Snippet)[];
		children?: Snippet;
		class?: string;
		emptyMessage?: string;
		isEmpty?: boolean;
	}

	let { 
		headers, 
		children, 
		class: className = '', 
		emptyMessage = 'データがありません',
		isEmpty = false
	}: Props = $props();
</script>

<div class="table-wrapper">
	<table class="list-table {className}">
		<thead>
			<tr>
				{#each headers as header}
					{#if typeof header === 'string'}
						<th>{header}</th>
					{:else}
						{@render header()}
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if isEmpty}
				<tr>
					<td colspan={headers.length} class="empty-message">
						{emptyMessage}
					</td>
				</tr>
			{:else}
				{@render children?.()}
			{/if}
		</tbody>
	</table>
</div>
