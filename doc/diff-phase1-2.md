# Phase 1 → Phase 2 差分記録

## 概要
Phase 1の基本電卓からPhase 2の複数画面対応電卓への移行差分。

## 主な変更点

### 1. ライブラリの追加
**追加されたパッケージ:**
- `@react-navigation/native`: ^7.1.14
- `@react-navigation/bottom-tabs`: ^7.4.2
- `react-native-screens`: ^4.11.1
- `react-native-safe-area-context`: ^5.5.0
- `@react-native-async-storage/async-storage`: ^2.2.0

### 2. ファイル構造の変更

#### 新規作成されたディレクトリ
- `screens/`: 画面コンポーネント用ディレクトリ
- `components/`: 再利用可能コンポーネント用ディレクトリ（今後使用予定）
- `utils/`: ユーティリティ関数用ディレクトリ

#### 新規作成されたファイル
- `screens/StandardCalculatorScreen.tsx`: 標準電卓画面
- `screens/ScientificCalculatorScreen.tsx`: 科学電卓画面
- `screens/HistoryScreen.tsx`: 履歴画面
- `utils/historyUtils.ts`: 履歴管理ユーティリティ

### 3. App.tsx の大幅リファクタリング

#### 変更前 (Phase 1)
```typescript
// 単一画面の電卓アプリ
export default function App() {
  // 電卓ロジックが直接記述
  const [display, setDisplay] = useState('0');
  // ... 計算機能の実装
  
  return (
    <View style={styles.container}>
      {/* 電卓UI */}
    </View>
  );
}
```

#### 変更後 (Phase 2)
```typescript
// タブナビゲーション対応
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        {/* 3つのタブ画面 */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

### 4. 機能の追加・拡張

#### 標準電卓 (StandardCalculatorScreen.tsx)
- Phase 1のコードを移植
- 履歴保存機能を追加
- イコール押下時に計算履歴をAsyncStorageに保存

#### 科学電卓 (ScientificCalculatorScreen.tsx)
- 三角関数: sin, cos, tan
- 対数関数: log, ln
- ルート・べき乗: √, x², x^y
- 定数: π, e
- 階乗: n!
- メモリ機能: MC, MR, M+, M-
- 各計算で履歴保存機能

#### 履歴画面 (HistoryScreen.tsx)
- 計算履歴の一覧表示
- 履歴項目の削除機能
- 全履歴削除機能
- 相対時間表示 (○分前、○時間前)
- useFocusEffectでタブ切り替え時の自動更新

#### 履歴管理システム (historyUtils.ts)
- AsyncStorageを使用した永続化
- 履歴の型定義 (CalculationHistory)
- CRUD操作の実装
- 最大100件の履歴保存制限
- 計算式フォーマット機能

### 5. UI/UX の向上

#### タブナビゲーション
- ダークテーマ対応のタブバー
- オレンジ色のアクティブタブ (#ff9500)
- 絵文字アイコン: 📱(標準)、🔬(科学)、📋(履歴)
- 日本語ラベル

#### 科学電卓のUI改善
- ScrollView対応（縦長画面対応）
- ボタンサイズ調整（70x70px）
- メモリインジケーター表示
- 科学計算ボタンの色分け (#666)

#### 履歴画面のUI
- iOS風のリスト表示
- 長押しで削除のインタラクション
- 空状態のプレースホルダー
- 全削除ボタン
- 項目セパレーター

### 6. データフロー

#### Phase 1
```
User Input → State Update → Display
```

#### Phase 2
```
User Input → State Update → Display
              ↓
           History Save (AsyncStorage)
              ↓
        History Screen Update
```

### 7. TypeScript型定義の追加

```typescript
// 履歴項目の型定義
interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}
```

### 8. 非同期処理の導入

- 履歴保存・読み込み処理
- AsyncStorage操作
- エラーハンドリング

### 9. React Navigation の活用

- useFocusEffect: タブ切り替え時の画面更新
- タブナビゲーション: 3画面間の切り替え
- 画面間でのデータ共有（AsyncStorage経由）

## 学習ポイント

1. **コンポーネント分離**: 単一ファイルから複数ファイルへの分割
2. **ナビゲーション**: React Navigationの基本的な使用方法
3. **データ永続化**: AsyncStorageによるローカルデータ保存
4. **状態管理**: 画面間でのデータ共有方法
5. **UI改善**: タブナビゲーション、ScrollView、適切なレイアウト設計

## 次のフェーズへの準備

Phase 3では以下の実装を予定：
- より高度な履歴機能（検索、フィルタリング）
- 設定画面の追加
- テーマ切り替え機能
- アニメーション効果の追加