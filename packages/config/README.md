# @notsobad/config

- notsobad-jpの共通Biome・TypeScript設定です。

## 導入

- Biome・TypeScriptのバージョンは、このパッケージの[peerDependencies](package.json)に合わせます。
- Hono・Node.jsの型は利用側の依存パッケージで用意し、`worker-configuration.d.ts`はWranglerで生成します。

```sh
pnpm add -D '@notsobad/config@github:notsobad-jp/.github#main&path:/packages/config' @biomejs/biome@2.5.15 typescript@7.0.2
```

- `pnpm-lock.yaml`をコミットし、開発環境とCIで同じコミットの設定を使います。

## 設定の継承

- 利用側の`biome.json`:

  ```json
  {
    "extends": ["@notsobad/config/biome"]
  }
  ```

- 利用側の`tsconfig.json`:

  ```json
  {
    "extends": "@notsobad/config/tsconfig.json"
  }
  ```

- フォーマットは共通設定に従い、Biomeに任せます。利用側で改行ルールを個別指定しません。
- CIでは`biome check`で、コードの問題とフォーマットの差分を検査します。
- プロジェクト固有の差分は、利用側の設定で上書きします。
- パス別名・型・検査対象と除外は利用側のルートを基準に解決されます。
- 具体的な設定値は[biome.json](biome.json)・[tsconfig.json](tsconfig.json)を参照してください。

## 更新

- 導入コマンドを再実行し、依存先コミットとlockfileの差分を確認します。
- `pnpm exec tsc --showConfig`による実効設定・検査対象と、Biomeのルール・除外を更新前後で比較します。
- 利用側のCI一式で検証します。

- 参照：[pnpmのGitリポジトリ・サブフォルダ依存](https://pnpm.io/10.x/package-sources#install-from-a-subdirectory-of-a-git-repository)
