# TypeScript・Biomeの共通設定

フォルダ構成・Hono・Cloudflareの型設定を共通設定で管理します。
利用側は[共通パッケージ](../packages/config/README.md)の設定を継承します。

## TypeScript

strict、ES2024、Bundlerによるモジュール解決、Hono JSXを採用します。
`@/*`は`src/*`を参照し、`src/`・`scripts/`・`test/`・`vitest.config.ts`を検査します。
`worker-configuration.d.ts`は各プロジェクトのWranglerで生成し、Node.jsの型とともに読み込みます。

共有ファイル内の`paths`と`include`には`${configDir}`を使い、利用側のルートを参照します。
`types`の`./worker-configuration.d.ts`は、利用側の設定ファイルを基準に解決されます。

## Biome

整形・基本Lint・Tailwindの構文設定・[レイヤー依存制約](architecture.md)をまとめて採用します。
検査対象と生成型・CSS・ビルド成果物の除外も共通設定に含めます。
Biomeの共有設定のパスは、継承する利用側の設定ファイルを基準に解決されます。

## 個別設定

プロジェクト固有の差分は、共通設定を継承した利用側の`tsconfig.json`・`biome.json`に定義します。

参照：[TypeScriptの`${configDir}`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-5.html#the-configdir-template-variable-for-configuration-files)、[Biomeの共有設定](https://biomejs.dev/configuration/big-projects/#other-ways-to-share-a-configuration-file)

## 記述規約

型・interface・オブジェクト・JSONのプロパティはアルファベット順にします。テスト・ドキュメントのコード例にも適用しますが、評価・上書きなど順序に意味がある場合はその意味を優先します。

## Zodモデルの記述

- schemaを型のsource of truthとし、公開モデルと型は同名にする。schema・型・振る舞いはドメイン概念ごとに同じファイルへまとめる。
- 内部schemaはモデル名に`Schema`を付けて定義する。振る舞いはモデルを引数に取る名前付き純粋関数として別に定義し、`this`に依存させない。
- 振る舞いがある場合は、定義済みのschemaと関数の参照を`Object.assign`でまとめ、モデル名で公開する。関数の参照はプロパティの省略記法を使い、`Object.assign`内にschemaや関数の定義を書かない。振る舞いがなければschemaをモデル名で公開する。
- オブジェクトモデルは公開時に`readonly()`を適用し、内部schemaは拡張可能に保つ。用途別schemaも内部schemaを再利用し、公開モデルの`unwrap()`を基本にしない。
- プロパティの許容値で表せる成立条件は、その値のschemaで定義し、推論型にも反映する。
- 通常は内部schemaと公開モデルの2段階にする。`BaseSchema`などの中間定義は、複数schemaでの共通部分の再利用など、合成上の役割がある場合だけ設ける。
- Zod標準の検証はデフォルトのエラーメッセージを使う。`refine`などの独自検証には検証内容に応じたメッセージを定義する。

### 復元・作成・操作の区別

基本schemaの`parse`は常に守る成立条件を検証し、保存済みモデルの復元にも使う。作成・削除などの操作時だけの条件を復元時に再適用しない。

作成・削除などの操作条件を検証として表現できる場合は、基本schemaを再利用する用途別schemaと同名の型を用意し、`parse`する。必要な外部値は入力で受け取り、出力にはモデルの値だけを残す。`XToCreate`・`XToDelete`のように用途を示し、汎用的な`ValidatedX`は避ける。

ID生成・初期値設定などの組み立てが必要な場合は`build`を使う。単純な`parse`のラッパーやfactoryは増やさない。値の計算や状態の変更を伴う操作は、明示的に呼び出す純粋関数で扱う。

用途別の型は検証した状態を引き継ぐための設計制約であり、セキュリティ境界ではない。Domain外で安易にcastせず、取得後の同時更新や別の日・集約への流用まで保証したとは扱わない。
