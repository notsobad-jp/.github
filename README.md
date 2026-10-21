# notsobad-jp 共通開発設定

notsobad-jp Organizationの設計原則・開発方針・共通ツール設定と、GitHub標準機能による共通設定を管理します。

## 開発標準とツール設定

| 場所 | 内容 | 利用方法 |
| --- | --- | --- |
| [docs/](docs/README.md) | 設計原則・開発方針 | 設計・実装時に関連する文書を参照 |
| [packages/config/](packages/config/README.md) | 共通Biome・TypeScript設定 | pnpmでGitHubから導入し、各リポジトリで継承 |

共通設定は`@notsobad/config`として利用します。
導入方法と設定例は[パッケージのREADME](packages/config/README.md)を参照してください。

## GitHub共通設定

| 対象 | 配置先 | 利用方法 |
| --- | --- | --- |
| Issueテンプレートとその設定 | `.github/ISSUE_TEMPLATE/` | Organization共通の既定テンプレートとして使用 |
| PRテンプレート | `PULL_REQUEST_TEMPLATE.md` | Organization共通の既定テンプレートとして使用 |
| Reusable Workflows | `.github/workflows/` | 各リポジトリのWorkflowから明示的に呼び出す |

Issue / PRテンプレートの共通利用には、このリポジトリがPublicである必要があります。
Issueテンプレートを利用するリポジトリではIssuesを有効にします。
適用先に独自のPRテンプレートがある場合は、そちらが優先されます。
適用先に有効なIssueテンプレートまたは設定がある場合は、そのリポジトリ側のIssueテンプレート一式を使用します。

Reusable Workflowsは`workflow_call`で呼び出し可能にし、
利用側で参照するWorkflowとバージョンを指定します。

## 参照

- [GitHub: デフォルトのコミュニティ健全性ファイル](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- [GitHub: Reusable Workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)
