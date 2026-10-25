# 構成とレイヤーの責務

- 各リポジトリでは、必要なレイヤーをこの配置・命名にそろえます。

| 配置 | 責務 | レイヤー間の参照先 |
| --- | --- | --- |
| `src/domain/` | モデル、業務判断、Repositoryの契約 | Domain |
| `src/application/` | 状態の取得、ドメイン操作、保存の組み立て | Application・Domain |
| `src/infrastructure/` | Repositoryの実装、DB・外部APIの操作とモデルへの変換 | Infrastructure・Domain |
| `src/presentation/` | 入力、HTTP応答、画面 | Presentation・Application・Domain |
| Workerの入口 | binding・設定の取得と具体実装の組み立て | 必要な各レイヤー |

- 開発用スクリプトは`scripts/`、結合テストなどは`test/`、Vitestの設定は`vitest.config.ts`に置きます。
- 単体テストは各レイヤー内の`*.test.ts`・`*.test.tsx`にも配置できます。

## 業務の表現と依存

- 別集約はIDで参照します。
- Applicationの依存はオブジェクトの引数で受け取り、操作の入力と分けます。
- Domain・Applicationから環境変数やHTTP Contextを参照しません。
- 日時計算はTemporalを使い、業務判断に必要な時刻はApplicationで一度確定して渡します。
- エラーを生成する際は通常の`Error`を使い、独自のエラークラスは作りません。
- 通常の成功経路を順に実行し、外部処理の失敗は元の例外を伝えます。
  - ログと応答への変換は入口で扱います。
- 環境による具体実装の選択も入口で行い、Domainには環境判定を持ち込みません。
- モデルの型と振る舞いは[Zodモデルの記述](typescript.md#zodモデルの記述)に従います。

## Repository

- 単一参照は`find`、複数参照は`findMany`を基本名とします。
- 対象がない場合、単一参照・更新は例外、複数参照は空配列を返します。
- 取得値はZodで復元します。
- 名称と責務は既存の用語に合わせ、単純な中継関数や将来のためだけの抽象化は増やしません。

## DBスキーマ

- migrationのカラム定義はプロパティのアルファベット順の対象外とし、主キー、関連ID、業務上の主要な項目、日時の順に並べます。
  - 作成・更新日時は末尾に置きます。
