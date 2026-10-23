# notsobad-jp 共通開発設定

- notsobad-jpの共通開発方針・設定を管理します。

## 構成

| 場所 | 内容 |
| --- | --- |
| [docs/](docs/README.md) | 共通開発方針と作業ごとの参照条件 |
| [packages/config/](packages/config/README.md) | Biome・TypeScript設定 |
| [.github/ISSUE_TEMPLATE/](.github/ISSUE_TEMPLATE/) | Issueテンプレート |
| [.github/pull_request_template.md](.github/pull_request_template.md) | PRテンプレート |
| [.github/workflows/](.github/workflows/) | 再利用可能なGitHub Actions workflow |

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
