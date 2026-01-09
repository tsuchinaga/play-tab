<script lang="ts">
	interface Props {
		instrument: string;
	}

	let { instrument }: Props = $props();
</script>

<span class="instrument-badge">
	{instrument}
</span>

<style>
	.instrument-badge {
		background: #e9ecef;
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 0.85rem;
		color: #495057;
		display: inline-block;
	}
</style>
