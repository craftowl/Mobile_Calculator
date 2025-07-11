# エラー修正記録

## 修正日時
2025-07-02

## 発生したエラー

### エラー内容
```
型 '[never, never]' の引数を型 'never' のパラメーターに割り当てることはできません。ts(2345)
```

### エラー発生箇所
`src/screens/HistoryScreen.tsx`の`onHistoryItemPress`関数内
```typescript
navigation.navigate('Standard' as never, { 
  recalculateValue: item.result 
} as never);
```

### エラーの原因
React Navigationの型定義が不適切で、TypeScriptが正しい型推論を行えなかった。
- `useNavigation()`フックに適切な型引数が指定されていない
- `navigation.navigate()`の引数に`as never`型アサーションを使用していた
- ナビゲーションパラメータの型定義が各ファイルで重複していた

## 修正内容

### 1. 共通型定義ファイルの作成
**新規ファイル**: `src/types/navigation.ts`
```typescript
export type RootTabParamList = {
  Standard: { recalculateValue?: string };
  Scientific: undefined;
  History: undefined;
};
```

### 2. HistoryScreen.tsxの修正
- `NavigationProp`型をインポート
- `useNavigation`フックに適切な型引数を指定
- `navigation.navigate()`から不適切な型アサーションを削除

**修正前**:
```typescript
const navigation = useNavigation();
navigation.navigate('Standard' as never, { 
  recalculateValue: item.result 
} as never);
```

**修正後**:
```typescript
const navigation = useNavigation<NavigationProp<RootTabParamList>>();
navigation.navigate('Standard', { 
  recalculateValue: item.result 
});
```

### 3. StandardCalculatorScreen.tsxの修正
- 重複していた型定義を削除
- 共通の型定義ファイルから型をインポート

### 4. ファイル構造の追加
```
src/
├── types/
│   └── navigation.ts  # ナビゲーション型定義
├── screens/
└── utils/
```

## 学習ポイント

1. **TypeScript型安全性**: React Navigationでは適切な型定義が重要
2. **型の一元管理**: 共通で使用する型は別ファイルに分離する
3. **型アサーション回避**: `as never`のような危険な型アサーションは避ける
4. **ジェネリクス活用**: React Navigationのフックは適切な型引数を指定する

## 修正結果
- TypeScriptのコンパイルエラーが解消
- ナビゲーション時の型安全性が向上
- コードの保守性とreadabilityが改善

---

## 修正日時
2025-07-02 (追加修正)

## 発生したエラー (2回目)

### エラー内容
計算履歴画面で履歴項目の削除が正常に動作しない

### エラーの原因
1. **型変換問題**: AsyncStorageから読み込み時にtimestampがstring型になり、Date型との不整合が発生
2. **エラーハンドリング不足**: 削除処理でエラーが発生してもユーザーに通知されない
3. **デバッグ情報不足**: 削除処理の途中でどこで失敗しているか分からない

## 修正内容

### 1. historyUtils.tsの修正
**問題**: JSON.parseでtimestampがDate型に復元されない
```typescript
// 修正前
return JSON.parse(historyJson);

// 修正後  
const parsedHistory = JSON.parse(historyJson);
return parsedHistory.map((item: any) => ({
  ...item,
  timestamp: new Date(item.timestamp)
}));
```

### 2. 削除処理の改善
**問題**: エラーハンドリングとデバッグ情報不足
```typescript
// 修正前
onPress: async () => {
  await deleteHistoryItemUtil(id);
  loadHistory();
}

// 修正後
onPress: async () => {
  try {
    console.log('削除開始 - ID:', id);
    await deleteHistoryItemUtil(id);
    console.log('削除完了、履歴を再読み込み');
    await loadHistory();
  } catch (error) {
    console.error('履歴削除でエラーが発生:', error);
    Alert.alert('エラー', '履歴の削除に失敗しました。');
  }
}
```

### 3. デバッグログの追加
削除処理にデバッグログを追加して問題箇所を特定できるように改善:
- 削除対象のID確認
- 削除前後の履歴件数確認
- 履歴内の全IDリスト確認

## 学習ポイント
1. **JSON シリアライゼーション**: Date型はJSON変換時にstring型になる
2. **AsyncStorage型安全性**: 保存時と読み込み時の型変換に注意
3. **エラーハンドリング**: ユーザー操作には適切なエラー通知が必要
4. **デバッグ手法**: console.logでデータフローを追跡する重要性