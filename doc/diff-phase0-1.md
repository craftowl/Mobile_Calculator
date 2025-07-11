# Phase 0 → Phase 1 差分記録

## 概要
初期状態（Expoボイラープレート）からPhase 1の基本電卓への実装差分。

## 初期状態 (Phase 0)

### ファイル構成
- `App.tsx`: 基本的なExpoボイラープレート
- `index.ts`: Expoエントリーポイント
- `app.json`: Expo設定
- `package.json`: 基本依存関係
- `tsconfig.json`: TypeScript設定

### App.tsx の初期状態
```typescript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## Phase 1 実装内容

### 1. 基本電卓UIの実装

#### 表示エリア
- 計算結果表示用の大きなテキストエリア
- 右寄せ配置
- 64pxの大きなフォントサイズ
- 薄いフォントウェイト

#### ボタンレイアウト
**5行4列のグリッドレイアウト:**
- 1行目: AC, +/-, %, ÷
- 2行目: 7, 8, 9, ×
- 3行目: 4, 5, 6, -
- 4行目: 1, 2, 3, +
- 5行目: 0 (ワイド), ., =

#### ボタンデザイン
- **数字ボタン**: 80x80px、角丸40px、グレー背景 (#333)
- **演算子ボタン**: オレンジ背景 (#ff9500)
- **機能ボタン**: ライトグレー背景 (#a6a6a6)
- **0ボタン**: 170px幅のワイドボタン

### 2. 状態管理の実装

#### useState による状態管理
```typescript
const [display, setDisplay] = useState('0'); // 表示値
const [previousValue, setPreviousValue] = useState<number | null>(null); // 前の値
const [operation, setOperation] = useState<string | null>(null); // 演算子
const [waitingForOperand, setWaitingForOperand] = useState(false); // 次の入力待ち状態
```

#### 状態の役割
- `display`: 現在画面に表示されている値
- `previousValue`: 演算子が押された時の前の値
- `operation`: 現在選択されている演算子（+, -, ×, ÷）
- `waitingForOperand`: 演算子の後で新しい数字入力を待っている状態

### 3. 基本機能の実装

#### 数字入力機能
```typescript
const inputNumber = (num: string) => {
  if (waitingForOperand) {
    setDisplay(num);
    setWaitingForOperand(false);
  } else {
    setDisplay(display === '0' ? num : display + num);
  }
};
```

#### 小数点入力機能
```typescript
const inputDecimal = () => {
  if (waitingForOperand) {
    setDisplay('0.');
    setWaitingForOperand(false);
  } else if (display.indexOf('.') === -1) {
    setDisplay(display + '.');
  }
};
```

#### クリア機能
```typescript
const clear = () => {
  setDisplay('0');
  setPreviousValue(null);
  setOperation(null);
  setWaitingForOperand(false);
};
```

### 4. 四則演算の実装

#### 演算子処理
```typescript
const performOperation = (nextOperation: string) => {
  const inputValue = parseFloat(display);

  if (previousValue === null) {
    setPreviousValue(inputValue);
  } else if (operation) {
    const currentValue = previousValue || 0;
    const newValue = calculate(currentValue, inputValue, operation);

    setDisplay(String(newValue));
    setPreviousValue(newValue);
  }

  setWaitingForOperand(true);
  setOperation(nextOperation);
};
```

#### 計算ロジック
```typescript
const calculate = (firstValue: number, secondValue: number, operation: string): number => {
  switch (operation) {
    case '+':
      return firstValue + secondValue;
    case '-':
      return firstValue - secondValue;
    case '×':
      return firstValue * secondValue;
    case '÷':
      return secondValue !== 0 ? firstValue / secondValue : 0;
    default:
      return secondValue;
  }
};
```

#### イコール処理
```typescript
const onEqualPress = () => {
  const inputValue = parseFloat(display);

  if (previousValue !== null && operation) {
    const newValue = calculate(previousValue, inputValue, operation);
    setDisplay(String(newValue));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  }
};
```

### 5. エラーハンドリング

#### 0除算対応
```typescript
case '÷':
  return secondValue !== 0 ? firstValue / secondValue : 0;
```

#### 無効な演算の防止
- 演算子が設定されていない場合のイコール処理をスキップ
- previousValueがnullの場合の適切な処理

### 6. UIデザインの実装

#### ダークテーマ
- 黒背景 (#000)
- 白文字
- iOSネイティブ電卓アプリを参考

#### レスポンシブレイアウト
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 50,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  buttonContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  // ... ボタンスタイル
});
```

### 7. インタラクション

#### TouchableOpacity
- 各ボタンにタップイベント
- 視覚的フィードバック
- 適切なonPress関数の割り当て

## 学習ポイント

### React Native基礎
1. **コンポーネント構造**: View, Text, TouchableOpacityの基本的な使い方
2. **スタイリング**: StyleSheetによるCSS-like スタイリング
3. **レイアウト**: Flexboxによるレスポンシブレイアウト

### React Hooks
1. **useState**: 複数の状態管理
2. **状態更新**: 非同期状態更新の理解
3. **状態依存**: 他の状態に基づく条件分岐

### TypeScript
1. **型定義**: string | null などの Union Types
2. **型安全**: parseFloat、Stringなどの型変換
3. **strict mode**: 厳密な型チェック

### 計算機ロジック
1. **状態機械**: 電卓の動作パターン
2. **演算順序**: 演算子優先度の実装
3. **エラーハンドリング**: エッジケースの処理

### UI/UX設計
1. **ユーザビリティ**: 直感的な操作感
2. **視覚デザイン**: 色彩とコントラスト
3. **レスポンシブ**: 異なる画面サイズへの対応

## 技術的な特徴

### アーキテクチャ
- **単一コンポーネント**: App.tsxに全機能を集約
- **ローカル状態**: useStateによるシンプルな状態管理
- **関数型**: 純粋関数による計算ロジック

### パフォーマンス
- **軽量**: 外部ライブラリ依存なし
- **高速**: 最小限の再レンダリング
- **メモリ効率**: 必要最小限の状態管理

### 保守性
- **明確な分離**: UI、状態管理、計算ロジックの分離
- **読みやすいコード**: 日本語コメントによる説明
- **型安全**: TypeScriptによる型保証

## 完成した機能

### ✅ 実装済み
- [x] 数字入力（0-9）
- [x] 小数点入力
- [x] 四則演算（+, -, ×, ÷）
- [x] イコール計算
- [x] オールクリア（AC）
- [x] 0除算エラーハンドリング
- [x] 連続計算機能
- [x] iOSライクなデザイン

### 🚫 未実装（Phase 2以降で対応）
- [ ] +/- 符号変更
- [ ] % パーセント計算
- [ ] 計算履歴
- [ ] 科学計算機能
- [ ] 設定・カスタマイズ

## Phase 2への準備

Phase 1で実装した基本的な電卓機能を基盤として、Phase 2では以下の拡張を予定：

1. **コンポーネント分離**: 単一ファイルから複数ファイルへの分割
2. **ナビゲーション**: React Navigationによる複数画面対応
3. **データ永続化**: AsyncStorageによる履歴保存
4. **機能拡張**: 科学計算機能の追加

Phase 1で確立した状態管理パターンと計算ロジックは、Phase 2でも継続して使用される設計となっている。