# プロジェクト構造説明書

## ファイル構成

### /App.tsx
**概要**: メインアプリケーションコンポーネント（Phase 2で大幅リファクタリング）  
**機能**: 
- React Navigation によるタブナビゲーション
- 3つの画面のルーティング（標準/科学/履歴）
- タブバーの設定とアイコン表示

### /src/screens/StandardCalculatorScreen.tsx
**概要**: 標準電卓画面コンポーネント  
**機能**: 
- 基本電卓のUI表示
- useState による計算機の状態管理
- 四則演算（+, -, ×, ÷）の実装
- 計算履歴の保存機能
- 履歴からの値受け取り機能
- エラーハンドリング（0除算対応）

**主要な状態管理**:
- `display`: 現在の表示値
- `previousValue`: 前回の計算値
- `operation`: 現在選択されている演算子
- `waitingForOperand`: 次の入力待ち状態

### /src/screens/ScientificCalculatorScreen.tsx
**概要**: 科学電卓画面コンポーネント  
**機能**: 
- 標準電卓機能 + 科学計算機能
- 三角関数（sin, cos, tan）
- 対数関数（log, ln）
- ルート・べき乗（√, x², x^y）
- 定数（π, e）
- 階乗（n!）
- メモリ機能（MC, MR, M+, M-）
- ScrollView対応（縦長画面）
- 科学計算の履歴保存

### /src/screens/HistoryScreen.tsx
**概要**: 計算履歴画面コンポーネント  
**機能**: 
- 計算履歴の一覧表示
- 履歴項目の削除機能（長押し）
- 全履歴削除機能
- 履歴からの再計算機能（タップ）
- 相対時間表示（○分前、○時間前）
- useFocusEffectによるタブ切り替え時の自動更新
- 空状態のプレースホルダー

### /src/components/AnimatedButton.tsx
**概要**: アニメーション付きボタンコンポーネント  
**機能**: 
- React Native Reanimatedによるスケールアニメーション
- Gesture Handlerによるタップジェスチャー
- ボタンタイプ別スタイリング（number/operator/function）
- テーマ対応の動的カラーリング

### /src/contexts/ThemeContext.tsx
**概要**: テーマ管理用React Context  
**機能**: 
- ライト/ダークテーマの状態管理
- AsyncStorageでのテーマ設定永続化
- アプリ全体でのテーマ切り替え機能
- useThemeカスタムフック提供

### /src/screens/SettingsScreen.tsx
**概要**: 設定画面コンポーネント  
**機能**: 
- テーマ切り替えスイッチ
- 小数点桁数設定（2-12桁）
- 履歴保存件数設定（50-1000件）
- 全履歴削除機能
- アプリ情報表示

### /src/types/navigation.ts
**概要**: ナビゲーション型定義ファイル  
**機能**: 
- React Navigationの型安全性を提供
- タブナビゲーションのパラメータ型定義
- 画面間でのデータ受け渡し型定義

### /src/types/theme.ts
**概要**: テーマ関連型定義ファイル  
**機能**: 
- ライト/ダークテーマの色定義
- テーマ型の定義
- 統一されたカラーパレット
- ColorPalette インターフェース

### /src/utils/historyUtils.ts
**概要**: 履歴管理ユーティリティ関数  
**機能**: 
- AsyncStorageを使用した履歴の永続化
- 履歴のCRUD操作
- 設定された履歴保存件数制限の適用
- 計算式フォーマット機能
- TypeScript型定義（CalculationHistory）

**主要な関数**:
- `saveCalculationHistory()`: 履歴保存
- `getCalculationHistory()`: 履歴取得
- `deleteHistoryItem()`: 個別削除
- `clearAllHistory()`: 全削除
- `formatExpression()`: 計算式フォーマット

### /src/utils/settingsUtils.ts
**概要**: 設定管理ユーティリティ関数  
**機能**: 
- AsyncStorageを使用した設定の永続化
- 小数点桁数設定の管理
- 履歴保存件数設定の管理
- 数値フォーマット機能

**主要な関数**:
- `getDecimalPlaces()`: 小数点桁数取得
- `setDecimalPlaces()`: 小数点桁数保存
- `getHistoryLimit()`: 履歴保存件数取得
- `setHistoryLimit()`: 履歴保存件数保存
- `formatNumber()`: 数値フォーマット

### /index.ts
**概要**: Expoルートコンポーネント登録ファイル  
**機能**: App.tsxコンポーネントをExpoに登録

### /app.json
**概要**: Expo設定ファイル  
**機能**: アプリの基本設定、プラットフォーム別設定

### /package.json
**概要**: Node.js依存関係とスクリプト定義  
**機能**: プロジェクトの依存関係管理、開発用スクリプト定義
**Phase 2で追加された依存関係**:
- @react-navigation/native
- @react-navigation/bottom-tabs
- @react-native-async-storage/async-storage
- react-native-screens
- react-native-safe-area-context

### /tsconfig.json
**概要**: TypeScript設定ファイル  
**機能**: TypeScriptコンパイラ設定（strict mode有効）

### /doc/expo_calculator_requirements.md
**概要**: プロジェクト要件定義書  
**機能**: 4段階開発計画と詳細機能要件の定義

### /doc/structure.md (このファイル)
**概要**: プロジェクト構造説明書  
**機能**: 作成したファイルの概要とプロジェクト全体の構造説明

### /doc/diff-phase1-2.md
**概要**: Phase 1からPhase 2への変更差分記録  
**機能**: 実装の変更点と学習ポイントの記録

### /CLAUDE.md
**概要**: Claude Code向けガイダンス  
**機能**: 開発コマンド、アーキテクチャ、開発ノートの提供

## ディレクトリ構造

```
/
├── App.tsx                          # メインアプリ（ナビゲーション）
├── index.ts                         # エントリーポイント
├── app.json                         # Expo設定
├── package.json                     # 依存関係
├── tsconfig.json                    # TypeScript設定
├── CLAUDE.md                        # Claude Code向けガイド
├── src/                             # ソースコードディレクトリ
│   ├── components/                  # 再利用可能コンポーネント
│   │   └── AnimatedButton.tsx       # アニメーション付きボタン
│   ├── contexts/                    # React Context
│   │   └── ThemeContext.tsx         # テーマ管理Context
│   ├── screens/                     # 画面コンポーネント
│   │   ├── StandardCalculatorScreen.tsx # 標準電卓
│   │   ├── ScientificCalculatorScreen.tsx # 科学電卓
│   │   ├── HistoryScreen.tsx        # 履歴画面
│   │   └── SettingsScreen.tsx       # 設定画面
│   ├── types/                       # 型定義ファイル
│   │   ├── navigation.ts            # ナビゲーション型定義
│   │   └── theme.ts                 # テーマ型定義
│   └── utils/                       # ユーティリティ関数
│       ├── historyUtils.ts          # 履歴管理
│       └── settingsUtils.ts         # 設定管理
├── components/                      # 再利用可能コンポーネント（今後使用予定）
├── doc/                             # ドキュメント
│   ├── expo_calculator_requirements.md # 要件定義書
│   ├── structure.md                 # 構造説明書（このファイル）
│   ├── diff-phase0-1.md             # Phase 0→1差分記録
│   ├── diff-phase1-2.md             # Phase 1→2差分記録
│   ├── diff-phase2-3.md             # Phase 2→3差分記録
│   ├── diff-phase3-4.md             # Phase 3→4差分記録
│   ├── error-fixed.md               # エラー修正記録
│   └── expo-go-fix.md               # Expo Go修正記録
└── assets/                          # 画像・アイコンファイル
    ├── icon.png
    ├── splash-icon.png
    ├── adaptive-icon.png
    └── favicon.png
```

## 現在の開発状況

### ✅ 完了済み (Phase 1)
- 基本電卓UIの実装
- useState による状態管理
- 四則演算機能
- エラーハンドリング
- iOSライクなデザイン

### ✅ 完了済み (Phase 2)
- React Navigation の導入
- 複数画面の実装（標準/科学/履歴）
- タブナビゲーション
- 科学計算機能の実装

### ✅ 完了済み (Phase 3)
- AsyncStorageによる履歴永続化
- 履歴の一覧表示
- 履歴からの再計算機能
- 履歴の削除機能
- 画面間でのデータ受け渡し

### ✅ 完了済み (Phase 4)
- テーマ切り替え機能（ダーク/ライトモード）
- ボタンのアニメーション効果
- 設定画面の実装
- 小数点桁数設定機能
- 履歴保存件数設定機能
- アプリ情報表示機能

### 🎉 プロジェクト完成
- 4段階の開発計画を完了
- プロダクションレベルの電卓アプリ
- 学習目標の達成

### 🔮 将来の拡張 (Phase 4以降)
- アニメーション効果の追加
- カスタムコンポーネント
- より複雑な状態管理（Context API等）
- テスト実装

### 📝 設計方針
- TypeScript strict mode使用
- React Hooks ベースの状態管理
- コンポーネント指向設計
- 日本語コメント記載
- iOSネイティブ電卓アプリのUI/UXを参考
- 責任分離の原則（画面・ユーティリティ・ナビゲーション）

### /.github/workflows/expo-build.yml
**概要**: Expoビルドチェック用GitHub Actionsワークフロー  
**機能**: 
- プッシュ・プルリクエスト時の自動ビルドチェック
- 依存関係のインストール
- Lint、Format、Typecheckの実行
- Expo CLI のセットアップ
- Android/iOS向けのprebuild実行
- ビルド設定ファイルの確認

## アーキテクチャパターン

### データフロー
```
User Input → Screen Component → State Update → Display
                ↓
           historyUtils.ts → AsyncStorage
                ↓
           History Screen (useFocusEffect)
```

### 状態管理
- **ローカル状態**: useState（各画面独立）
- **永続化**: AsyncStorage（履歴データ）
- **画面間通信**: ファイルベースのユーティリティ関数

### UIパターン
- **標準電卓**: 5x4グリッドレイアウト
- **科学電卓**: ScrollView + 8行のボタン配置
- **履歴画面**: FlatList + 削除インタラクション
- **タブナビゲーション**: Bottom Tabs

## スタイリング

### カラーパレット
- **背景**: 黒 (#000)
- **数字ボタン**: グレー (#333)
- **演算子ボタン**: オレンジ (#ff9500)  
- **機能ボタン**: ライトグレー (#a6a6a6)
- **科学ボタン**: ダークグレー (#666)
- **タブバー**: ダークグレー (#1c1c1e)

### デザイン原則
- ダークテーマ統一
- タップフィードバック対応
- レスポンシブデザイン
- アクセシビリティ配慮
- iOS HIG準拠