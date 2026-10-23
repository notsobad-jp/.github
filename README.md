# notsobad-jp 共通開発設定

- notsobad-jpの共通開発方針・設定を管理します。

## 構成

| 場所 | 内容 |
| --- | --- |
| [docs/](docs/README.md) | 共通の専門資料一覧 |
| [packages/config/](packages/config/README.md) | Biome・TypeScript設定 |
| [.github/ISSUE_TEMPLATE/](.github/ISSUE_TEMPLATE/) | Issueテンプレート |
| [.github/pull_request_template.md](.github/pull_request_template.md) | PRテンプレート |
| [.github/workflows/](.github/workflows/) | 再利用可能なGitHub Actions workflow |

## 共通開発方針の利用

- 各リポジトリのAGENTS.mdに、共通方針と必要な専門資料への直接リンクを記載します。以下の例から、そのリポジトリの採用技術と作業に合う項目を使います。

```md
- 共通規約との差分・開発環境・検証手順は、このリポジトリの資料に従います。
- 設計・仕様の変更時は、関連するdocsも更新します。
- 検証の失敗をチェックの無効化や省略で回避しません。
- 構成・責務・DBの変更は[設計規約](https://github.com/notsobad-jp/.github/blob/main/docs/architecture.md)に従います。
- TypeScript・JSON・Zodの変更は[TypeScript規約](https://github.com/notsobad-jp/.github/blob/main/docs/typescript.md)に従います。
- Web UIの変更は[UI規約](https://github.com/notsobad-jp/.github/blob/main/docs/ui.md)に従います。
- 検証・テストは[テスト方針](https://github.com/notsobad-jp/.github/blob/main/docs/testing.md)に従います。
```

## 共通CIの利用

- 利用側のworkflowのジョブから、`uses: notsobad-jp/.github/.github/workflows/pnpm-ci.yml@<commit SHA>`で呼び出します。
  - 実行イベントと`permissions: { contents: read }`は利用側に定義します。
  - 更新時は参照SHAの差分を確認し、利用側のCIで検証します。
- 利用側のルートには次を用意します。
  - Node.jsのバージョンを指定する`.node-version`。
  - pnpmのバージョンを指定する`package.json`の`packageManager`と、プロジェクト固有の検証をまとめる`scripts.ci`。
  - `pnpm-lock.yaml`。

## 参照

- [GitHub: デフォルトのコミュニティ健全性ファイル](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- [GitHub: Reusable Workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)
