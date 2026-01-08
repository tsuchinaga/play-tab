<script lang="ts">
	import Button from '$lib/components/common/Button.svelte';
</script>

<svelte:head>
	<title>使い方 | Play Tab</title>
</svelte:head>

<div class="list-container">
	<div class="list-header">
		<h1>使い方</h1>
	</div>

	<div class="form-card usage-card">
		<h2>検索方法</h2>
		<p>
			ヘッダーの「検索」リンク、またはトップページの検索フォームからTAB譜を検索できます。
			曲名でのキーワード検索のほか、楽器を指定して絞り込むことも可能です。
		</p>
	</div>

	<div class="form-card usage-card">
		<h2>再生方法</h2>
		<p>
			TAB譜の詳細ページにある再生ボタンをクリックすると、ブラウザ上で演奏を再生できます。
			BPM（テンポ）の調整や、特定のトラックのミュート・ソロ再生も可能です。
		</p>
	</div>

	<div class="form-card usage-card">
		<h2>TAB譜の作り方と編集方法</h2>
		<p>
			ログイン後、メニューの「TAB譜」画面にある「新規作成」ボタンから新しいTAB譜を登録できます。
			作成したTAB譜は、一覧の「編集」ボタンからいつでも内容を更新できます。
		</p>
		<p>
			TAB譜の記述には <strong>alphaTex</strong> 形式を使用します。
			エディタでは、トラックごとにTexを記述し、リアルタイムでプレビューを確認しながら作成できます。
		</p>
	</div>

	<div class="form-card usage-card">
		<h2>公開設定</h2>
		<p>
			作成したTAB譜には、以下の3段階の公開設定があります。
		</p>
		<ul>
			<li><strong>公開:</strong> 全てのユーザーが検索・閲覧できます。</li>
			<li><strong>限定公開:</strong> 検索結果には表示されませんが、URLを知っているユーザーは閲覧できます。</li>
			<li><strong>非公開:</strong> 作成者本人のみが閲覧・編集できます。</li>
		</ul>
		<p>
			さらに詳細設定として、「Texソースコード」や「バージョン履歴」をどの範囲まで公開するかを個別に設定することも可能です。
		</p>
	</div>

	<div class="form-card usage-card">
		<h2>alphaTexについて</h2>
		<p>
			本サービスでは、TAB譜の描画エンジンとして <a href="https://www.alphatab.net/" target="_blank" rel="noopener noreferrer">alphaTab</a> を使用しており、
			その独自の記述形式である <strong>alphaTex</strong> でTAB譜を作成する必要があります。
		</p>
		<p>
			詳細な記法やリファレンスについては、下記の公式ドキュメントを参照してください。
		</p>
		<div class="external-link">
			<Button href="https://alphatab.net/docs/alphatex/introduction" variant="outline" class="btn-doc">
				alphaTex 公式ドキュメント
			</Button>
		</div>
	</div>
</div>

<style>
	.usage-card {
		margin-bottom: 2rem;
		padding: 2rem;
	}

	.usage-card h2 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #007bff;
		color: #333;
		font-size: 1.5rem;
	}

	.usage-card p {
		line-height: 1.8;
		color: #495057;
		margin-bottom: 1rem;
	}

	.usage-card ul {
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	.usage-card li {
		margin-bottom: 0.5rem;
		color: #495057;
	}

	.external-link {
		margin-top: 1.5rem;
		display: flex;
		justify-content: center;
	}

	:global(.btn-doc) {
		width: auto !important;
		min-width: 200px;
		padding: 0.75rem 2rem !important;
	}
</style>
