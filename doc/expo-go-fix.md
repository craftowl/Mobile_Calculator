# Expo Go 動作修正記録

## 修正日時
2025-07-02

## 問題
Expo Goでアプリが正常に動作しない

## 原因

### 1. パッケージバージョンの不一致
以下のパッケージがExpo SDK 53の要求バージョンと一致していませんでした：
- `@react-native-async-storage/async-storage@2.2.0` → `2.1.2`が必要
- `expo@53.0.13` → `53.0.15`が必要  
- `react-native-safe-area-context@5.5.0` → `5.4.0`が必要

### 2. New Architecture有効化
`app.json`で`"newArchEnabled": true`が設定されていましたが、Expo GoはまだNew Architecture（Fabric/TurboModules）に対応していません。

## 修正手順

### 1. パッケージバージョンの修正
```bash
npx expo-doctor
npx expo install --fix
```

### 2. New Architectureの無効化
`app.json`を修正：
```json
{
  "expo": {
    "newArchEnabled": false
  }
}
```

### 3. 修正の確認
```bash
npx expo-doctor
```
すべてのチェックが通ることを確認。

## 修正後の状態
- すべてのパッケージがExpo SDK 53と互換性のあるバージョンに更新
- New Architectureを無効化してExpo Go対応
- expo-doctorで15/15チェック通過

## 注意事項
- New Architectureを使用したい場合は、Expo Goではなく開発ビルド（EAS Build）を使用する必要があります
- 今回の修正により、Expo Goでの動作確認が可能になりました

## 次のステップ
1. 開発サーバーを再起動
2. Expo Goアプリでプロジェクトをスキャン
3. アプリの動作確認

```bash
pnpm start
# または
npx expo start
```

## Expo Go がうまくつながらないとき
QR を読み込んだ後、つながらない時があります。

どうやらネットワークに問題があるようで、PCとスマホに疎通ができない場合があるようです。こういうときは @expo/ngrok を使用してトンネリングするといいらしい。

```bash
npm i @expo/ngrok
```

起動時のコマンドに --tunnel をつけます。

```bash
npx expo start --tunnel
```

もう一度QRコードからアクセスしてみるとうまくいきました。