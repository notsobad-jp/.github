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
