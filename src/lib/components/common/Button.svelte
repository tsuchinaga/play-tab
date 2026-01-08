<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'outline' | 'danger-outline' | 'search' | 'clear';
		href?: string;
		onclick?: (e: MouseEvent) => void;
		children?: Snippet;
		disabled?: boolean;
		class?: string;
	}

	let { 
		type = 'button', 
		variant = 'primary', 
		href, 
		onclick, 
		children, 
		disabled = false,
		class: className = ''
	}: Props = $props();

	const baseClass = $derived(`btn-${variant} ${className}`);
</script>

{#if href}
	<a {href} class={baseClass} {onclick}>
		{@render children?.()}
	</a>
{:else}
	<button {type} class={baseClass} {onclick} {disabled}>
		{@render children?.()}
	</button>
{/if}

<style>
	/* 基本スタイルは +layout.svelte の :global で定義されているが、
	   ここではコンポーネント固有の微調整を行う可能性がある */
</style>
