# notsobad-jp 共通開発設定

- notsobad-jp Organizationの設計原則・開発方針・共通ツール設定と、GitHub標準機能による共通設定を管理します。

## 開発標準とツール設定

| 場所 | 内容 | 利用方法 |
| --- | --- | --- |
| [docs/](docs/README.md) | 設計原則・開発方針 | 設計・実装時に関連する文書を参照 |
| [packages/config/](packages/config/README.md) | 共通Biome・TypeScript設定 | pnpmでGitHubから導入し、各リポジトリで継承 |

- 共通設定は`@notsobad/config`として利用します。
- 導入方法と設定例は[パッケージのREADME](packages/config/README.md)を参照してください。

## GitHub共通設定

| 対象 | 配置先 | 利用方法 |
| --- | --- | --- |
| Issueテンプレート | [.github/ISSUE_TEMPLATE/task.md](.github/ISSUE_TEMPLATE/task.md) | 概要・完了条件を記載する共通の既定テンプレート |
| PRテンプレート | [.github/pull_request_template.md](.github/pull_request_template.md) | Organization共通の既定テンプレートとして使用 |
| pnpmのCI | [.github/workflows/pnpm-ci.yml](.github/workflows/pnpm-ci.yml) | 各リポジトリのWorkflowから明示的に呼び出す |

- テンプレートはGitHubの[組織共通の既定ファイル](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)として適用されます。

### 共通CIの利用

- 利用側の`.github/workflows/`にトリガー・同時実行制御・`permissions: { contents: read }`を定義し、ジョブの`uses`で`notsobad-jp/.github/.github/workflows/pnpm-ci.yml@<commit SHA>`を呼び出します。
  - `<commit SHA>`は利用する共通リポジトリのコミットSHAに置き換え、更新時は変更内容を確認して利用側のCIで検証します。

- 共通workflowは利用側の`pnpm run ci`を実行します。
- 利用側のルートには次を用意します。
  - Node.jsのバージョンを指定する`.node-version`。
  - pnpmのバージョンを指定する`package.json`の`packageManager`と、プロジェクト固有の検証をまとめる`scripts.ci`。
  - `pnpm-lock.yaml`。

- 必要な型生成・テスト環境の準備は各プロジェクトの`ci`スクリプトで行います。
- このworkflowはSecretsの受け渡しを必要とせず、外部サービスに依存しない検証に使います。

## 参照

- [GitHub: デフォルトのコミュニティ健全性ファイル](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- [GitHub: Reusable Workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)
