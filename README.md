# notsobad-jp のGitHub共通設定

notsobad-jp Organizationの、GitHub標準機能による共通設定を管理します。
設計原則・開発環境・共通ツール設定はdotfilesで管理します。

## 配置先

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
