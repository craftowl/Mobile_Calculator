import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeType, lightTheme, darkTheme } from '../types/theme';

// テーマコンテキストの型定義
interface ThemeContextType {
  theme: Theme;
  themeType: ThemeType;
  toggleTheme: () => void;
  setTheme: (themeType: ThemeType) => void;
}

// テーマコンテキストの作成
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// テーマ設定のAsyncStorageキー
const THEME_STORAGE_KEY = 'calculatorTheme';

// テーマプロバイダーのProps型
interface ThemeProviderProps {
  children: ReactNode;
}

// テーマプロバイダーコンポーネント
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>('dark'); // デフォルトはダークテーマ
  const [theme, setTheme] = useState<Theme>(darkTheme);

  // 初期化時にAsyncStorageからテーマ設定を読み込み
  useEffect(() => {
    loadTheme();
  }, []);

  // テーマタイプが変更された時にテーマオブジェクトを更新
  useEffect(() => {
    const newTheme = themeType === 'light' ? lightTheme : darkTheme;
    setTheme(newTheme);
  }, [themeType]);

  // AsyncStorageからテーマ設定を読み込む
  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setThemeType(savedTheme);
      }
    } catch (error) {
      console.error('テーマの読み込みに失敗しました:', error);
    }
  };

  // AsyncStorageにテーマ設定を保存
  const saveTheme = async (newThemeType: ThemeType) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeType);
    } catch (error) {
      console.error('テーマの保存に失敗しました:', error);
    }
  };

  // テーマを切り替える
  const toggleTheme = () => {
    const newThemeType = themeType === 'light' ? 'dark' : 'light';
    setThemeType(newThemeType);
    saveTheme(newThemeType);
  };

  // 特定のテーマに設定する
  const setThemeFunction = (newThemeType: ThemeType) => {
    setThemeType(newThemeType);
    saveTheme(newThemeType);
  };

  const contextValue: ThemeContextType = {
    theme,
    themeType,
    toggleTheme,
    setTheme: setThemeFunction,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// テーマコンテキストを使用するカスタムフック
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
