# @notsobad/config

notsobad-jpの共通Biome・TypeScript設定です。
フォルダ構成・対象ファイル・生成物の除外・Hono・Cloudflareの型設定まで共通に扱います。
プロジェクト固有の差分は、利用側の設定で上書きします。

## 内容

| ファイル | 役割 |
| --- | --- |
| `biome.json` | 整形・基本Lint・Tailwind構文・レイヤー依存制約・検査対象と除外 |
| `tsconfig.json` | strict・Hono JSX・Cloudflare生成型・パス別名・検査対象 |

## 導入

```sh
pnpm add -D '@notsobad/config@github:notsobad-jp/.github#main&path:/packages/config' @biomejs/biome@2.5.15 typescript@7.0.2
```

GitHubの`packages/config/`を依存パッケージとして取り込みます。
`pnpm-lock.yaml`をコミットし、開発環境とCIで同じコミットの設定を使います。
共通設定を更新するときは、上記の導入コマンドを再実行し、依存先とlockfileの変更を確認します。
更新時は`pnpm exec tsc --showConfig`による実効設定・検査対象と、Biomeのルール・除外を更新前後で確認します。各リポジトリのCI一式で検証し、lockfileもコミットします。

## 設定の継承

利用側にパッケージと、`package.json`の`peerDependencies`に対応するBiome・TypeScriptを導入し、次の設定を置きます。
Hono・Node.jsの型は利用側の依存パッケージで用意し、`worker-configuration.d.ts`はWranglerで生成します。
各プロジェクトのclone場所は任意です。

`biome.json`:

```json
{
  "extends": ["@notsobad/config/biome"]
}
```

`tsconfig.json`:

```json
{
  "extends": "@notsobad/config/tsconfig.json"
}
```

`@/*`は利用側の`src/*`を参照し、`src/`・`scripts/`・`test/`・`vitest.config.ts`を型チェックします。
`paths`と`include`の`${configDir}`は利用側のルートを表します。
Biomeの検査対象と除外パスも利用側のルートを基準に解決されます。

参照：[pnpmのGitリポジトリ・サブフォルダ依存](https://pnpm.io/10.x/package-sources#install-from-a-subdirectory-of-a-git-repository)
