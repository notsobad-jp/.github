# 構成とレイヤーの責務

各リポジトリでは、必要なレイヤーをこの配置・命名にそろえます。

| 配置 | 責務 | レイヤー間の参照先 |
| --- | --- | --- |
| `src/domain/` | モデル、業務判断、Repositoryの契約 | Domain |
| `src/application/` | 状態の取得、ドメイン操作、保存の組み立て | Application・Domain |
| `src/infrastructure/` | DB・外部APIの操作とモデルへの変換 | Infrastructure・Domain |
| `src/presentation/` | 入力、HTTP応答、画面 | Presentation・Application・Domain |
| Workerの入口 | binding・設定の取得と具体実装の組み立て | 必要な各レイヤー |

Repositoryの契約はDomain、具体実装はInfrastructureに置き、入口で組み立てます。
HonoによるHTTP処理は、業務判断・ユースケースから分けて扱います。
Biomeは、上記のレイヤー間の参照とDomain・ApplicationからのHono参照を検査します。
テストファイルはレイヤーをまたぐ検証のため、依存制約の対象から除外します。

開発用スクリプトは`scripts/`、結合テストなどは`test/`、Vitestの設定は`vitest.config.ts`に置きます。
単体テストは各レイヤー内の`*.test.ts`・`*.test.tsx`にも配置できます。

共通設定には、この配置を前提とした検査対象・パス別名・生成物の除外を含めます。
