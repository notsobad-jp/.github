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

## 業務の表現と依存

別集約はIDで参照します。状態の取得と保存はApplication、業務上の判断はDomainに置きます。
Applicationの依存はオブジェクトの引数で受け取り、操作の入力と分けます。Domain・Applicationから環境変数やHTTP Contextを参照しません。
日時計算はTemporalを使い、業務判断に必要な時刻はApplicationで一度確定して渡します。
通常の成功経路を順に実行し、外部処理の失敗は元の例外を伝えます。ログと応答への変換は入口で扱います。
環境による具体実装の選択も入口で行い、Domainには環境判定を持ち込みません。
モデルの型と振る舞いは[Zodモデルの記述](typescript.md#zodモデルの記述)に従います。

## Repository

単一参照は`find`、複数参照は`findMany`を基本名とします。不存在では単一参照・更新は例外、複数参照は空配列を返します。
取得値はZodで復元し、DB列の変換はInfrastructureに置きます。
名称と責務は既存の用語に合わせ、単純な中継関数や将来のためだけの抽象化は増やしません。

## DBスキーマ

migrationのカラム定義はプロパティのアルファベット順の対象外とし、主キー、関連ID、業務上の主要な項目、日時の順に並べます。作成・更新日時は末尾に置きます。
初回リリースまでは、既存スキーマの修正を定義元のmigrationへ反映し、差分だけのファイルは追加しません。
