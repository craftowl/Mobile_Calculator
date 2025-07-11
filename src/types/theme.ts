// テーマ関連の型定義ファイル

// テーマタイプの定義
export type ThemeType = 'light' | 'dark';

// カラーパレットの型定義
export interface ColorPalette {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  error: string;
  warning: string;
  success: string;
}

// テーマオブジェクトの型定義
export interface Theme {
  type: ThemeType;
  colors: ColorPalette;
}

// ライトテーマの定義
export const lightTheme: Theme = {
  type: 'light',
  colors: {
    background: '#ffffff',
    surface: '#f5f5f5',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#ff9500',
    secondary: '#a6a6a6',
    accent: '#007aff',
    border: '#e0e0e0',
    error: '#ff3b30',
    warning: '#ff9500',
    success: '#34c759',
  },
};

// ダークテーマの定義
export const darkTheme: Theme = {
  type: 'dark',
  colors: {
    background: '#000000',
    surface: '#1c1c1e',
    text: '#ffffff',
    textSecondary: '#8e8e93',
    primary: '#ff9500',
    secondary: '#333333',
    accent: '#0a84ff',
    border: '#2c2c2e',
    error: '#ff453a',
    warning: '#ff9f0a',
    success: '#30d158',
  },
};