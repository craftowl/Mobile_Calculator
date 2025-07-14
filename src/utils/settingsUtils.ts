import AsyncStorage from '@react-native-async-storage/async-storage';

// 設定のAsyncStorageキー
export const DECIMAL_PLACES_KEY = 'calculatorDecimalPlaces';
export const HISTORY_LIMIT_KEY = 'calculatorHistoryLimit';

// 設定のデフォルト値
export const DEFAULT_DECIMAL_PLACES = 10;
export const DEFAULT_HISTORY_LIMIT = 100;

// 小数点桁数設定を取得
export const getDecimalPlaces = async (): Promise<number> => {
  try {
    const savedDecimalPlaces = await AsyncStorage.getItem(DECIMAL_PLACES_KEY);
    return savedDecimalPlaces
      ? parseInt(savedDecimalPlaces, 10)
      : DEFAULT_DECIMAL_PLACES;
  } catch (error) {
    console.error('小数点桁数設定の取得に失敗しました:', error);
    return DEFAULT_DECIMAL_PLACES;
  }
};

// 小数点桁数設定を保存
export const setDecimalPlaces = async (places: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(DECIMAL_PLACES_KEY, places.toString());
  } catch (error) {
    console.error('小数点桁数設定の保存に失敗しました:', error);
  }
};

// 履歴保存件数設定を取得
export const getHistoryLimit = async (): Promise<number> => {
  try {
    const savedHistoryLimit = await AsyncStorage.getItem(HISTORY_LIMIT_KEY);
    return savedHistoryLimit
      ? parseInt(savedHistoryLimit, 10)
      : DEFAULT_HISTORY_LIMIT;
  } catch (error) {
    console.error('履歴保存件数設定の取得に失敗しました:', error);
    return DEFAULT_HISTORY_LIMIT;
  }
};

// 履歴保存件数設定を保存
export const setHistoryLimit = async (limit: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(HISTORY_LIMIT_KEY, limit.toString());
  } catch (error) {
    console.error('履歴保存件数設定の保存に失敗しました:', error);
  }
};

// 数値をフォーマットする（小数点桁数設定を適用）
export const formatNumber = (value: number, decimalPlaces?: number): string => {
  const places = decimalPlaces || DEFAULT_DECIMAL_PLACES;

  // 整数の場合は小数点以下を表示しない
  if (Number.isInteger(value)) {
    return value.toString();
  }

  // 小数点桁数を制限
  const formatted = value.toFixed(places);

  // 末尾の0を削除
  return formatted.replace(/\.?0+$/, '');
};
