import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHistoryLimit } from './settingsUtils';

// 計算履歴の型定義
export interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

// 履歴保存用のキー
const HISTORY_STORAGE_KEY = 'calculatorHistory';

// 履歴を保存する関数
export const saveCalculationHistory = async (
  expression: string,
  result: string
): Promise<void> => {
  try {
    // 現在の履歴を取得
    const existingHistory = await getCalculationHistory();

    // 新しい履歴項目を作成
    const newHistoryItem: CalculationHistory = {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: new Date(),
    };

    // 履歴リストの先頭に追加（最新が上に来るように）
    const updatedHistory = [newHistoryItem, ...existingHistory];

    // 設定された履歴保存件数を取得
    const historyLimit = await getHistoryLimit();

    // 履歴の最大件数を制限
    const limitedHistory = updatedHistory.slice(0, historyLimit);

    // AsyncStorageに保存
    await AsyncStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(limitedHistory)
    );
  } catch (error) {
    console.error('履歴の保存に失敗しました:', error);
  }
};

// 履歴を取得する関数
export const getCalculationHistory = async (): Promise<
  CalculationHistory[]
> => {
  try {
    const historyJson = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (historyJson) {
      const parsedHistory = JSON.parse(historyJson);
      // timestampをDate型に変換
      return parsedHistory.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    }
    return [];
  } catch (error) {
    console.error('履歴の取得に失敗しました:', error);
    return [];
  }
};

// 特定の履歴項目を削除する関数
export const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
    console.log('削除対象ID:', id);
    const existingHistory = await getCalculationHistory();
    console.log('削除前の履歴件数:', existingHistory.length);
    console.log(
      '履歴のID一覧:',
      existingHistory.map((item) => item.id)
    );

    const updatedHistory = existingHistory.filter((item) => item.id !== id);
    console.log('削除後の履歴件数:', updatedHistory.length);

    await AsyncStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(updatedHistory)
    );
    console.log('履歴の削除が完了しました');
  } catch (error) {
    console.error('履歴項目の削除に失敗しました:', error);
  }
};

// 全履歴を削除する関数
export const clearAllHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('履歴の全削除に失敗しました:', error);
  }
};

// 計算式のフォーマット関数
export const formatExpression = (
  previousValue: number | null,
  operation: string | null,
  currentValue: string
): string => {
  if (previousValue !== null && operation) {
    return `${previousValue} ${operation} ${currentValue}`;
  }
  return currentValue;
};
