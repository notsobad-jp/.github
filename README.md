# notsobad-jp のGitHub共通設定

notsobad-jp Organizationの、GitHub標準機能による共通設定を管理します。
設計原則・開発環境・共通ツール設定はdotfilesで管理します。

## 配置先

必要な内容を決めてから、次の場所に追加します。現在はこのREADMEのみです。

| 対象 | 配置先 | 利用方法 |
| --- | --- | --- |
| Issueテンプレートとその設定 | `.github/ISSUE_TEMPLATE/` | 各リポジトリに独自設定がない場合にGitHubが使用 |
| PRテンプレート | `PULL_REQUEST_TEMPLATE.md` | 各リポジトリに独自テンプレートがない場合にGitHubが使用 |
| Reusable Workflows | `.github/workflows/` | 各リポジトリのWorkflowから明示的に呼び出す |

Issue / PRテンプレートの共通利用には、このリポジトリがPublicである必要があります。
ローカルへのcloneは不要です。Issueテンプレートを利用するリポジトリではIssuesを有効にします。
適用先に有効なIssueテンプレートまたは設定があれば、共通のIssueテンプレート一式は使われません。

共通Workflowは自動適用されません。実装時は`workflow_call`で呼び出し可能にし、
利用側で参照するWorkflowとバージョンを指定します。

今回はテンプレート・Workflowを追加せず、既存リポジトリの動作を変えません。
`profile/`、`CONTRIBUTING.md`、`CODE_OF_CONDUCT.md`も現時点では追加しません。

## 参照

- [GitHub: デフォルトのコミュニティ健全性ファイル](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file)
- [GitHub: Reusable Workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)
