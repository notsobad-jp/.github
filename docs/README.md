# notsobad-jp 共通開発標準

対象はnotsobad-jp Organization配下のリポジトリです。
設計原則・開発方針の正本を管理します。

## 基本方針

- DDD / Clean Architectureを基本とし、必要なレイヤーだけを設ける。
- レイヤー間の依存をDomainに向かう方向でそろえ、存在するレイヤーの命名・配置を統一する。
- 機械的に検証できるルールはLint・型チェック・CIで検証し、文書は設計判断を中心に扱う。
- フォルダ構成・実行環境・対象パスも含めて共通設定を継承し、プロジェクト固有の差分は利用側で定義する。

## 参照先

設計判断が必要なときは、関連する文書を参照してください。

| 文書 | 扱う内容 |
| --- | --- |
| [architecture.md](architecture.md) | レイヤーの責務、命名・配置・依存方向 |
| [typescript.md](typescript.md) | 型・Lint設定と共有時のパスの扱い |

## ツール設定との分担

BiomeをLinter / Formatterに採用し、TypeScriptはstrictを基本とする方針です。
レイヤー間の依存制約はBiomeで検査します。
設定ソースと継承方法は[packages/config/](../packages/config/README.md)を参照してください。
