import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { clearAllHistory } from '../utils/historyUtils';
import { 
  getDecimalPlaces, 
  setDecimalPlaces, 
  getHistoryLimit, 
  setHistoryLimit 
} from '../utils/settingsUtils';

// 設定画面のコンポーネント
export default function SettingsScreen() {
  const { theme, themeType, toggleTheme } = useTheme();
  const [decimalPlaces, setDecimalPlaces] = useState(10);
  const [historyLimit, setHistoryLimit] = useState(100);

  // 初期化時に設定を読み込み
  useEffect(() => {
    loadSettings();
  }, []);

  // AsyncStorageから設定を読み込む
  const loadSettings = async () => {
    try {
      const savedDecimalPlaces = await getDecimalPlaces();
      const savedHistoryLimit = await getHistoryLimit();
      
      setDecimalPlaces(savedDecimalPlaces);
      setHistoryLimit(savedHistoryLimit);
    } catch (error) {
      console.error('設定の読み込みに失敗しました:', error);
    }
  };

  // 小数点桁数設定を保存
  const saveDecimalPlaces = async (places: number) => {
    try {
      await setDecimalPlaces(places);
      setDecimalPlaces(places);
    } catch (error) {
      console.error('小数点桁数設定の保存に失敗しました:', error);
    }
  };

  // 履歴保存件数設定を保存
  const saveHistoryLimit = async (limit: number) => {
    try {
      await setHistoryLimit(limit);
      setHistoryLimit(limit);
    } catch (error) {
      console.error('履歴保存件数設定の保存に失敗しました:', error);
    }
  };

  // 全履歴削除の確認ダイアログ
  const handleClearAllHistory = () => {
    Alert.alert(
      '全履歴削除',
      '本当にすべての計算履歴を削除しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllHistory();
              Alert.alert('完了', 'すべての履歴を削除しました。');
            } catch (error) {
              Alert.alert('エラー', '履歴の削除に失敗しました。');
            }
          }
        }
      ]
    );
  };

  // 設定項目をレンダリング
  const renderSettingItem = (title: string, children: React.ReactNode) => (
    <View style={[styles.settingItem, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
      {children}
    </View>
  );

  // 数値選択ボタンをレンダリング
  const renderNumberSelector = (
    currentValue: number,
    options: number[],
    onSelect: (value: number) => void,
    suffix: string = ''
  ) => (
    <View style={styles.numberSelector}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.numberOption,
            {
              backgroundColor: currentValue === option ? theme.colors.primary : theme.colors.background,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.numberOptionText,
              {
                color: currentValue === option ? '#fff' : theme.colors.text,
              }
            ]}
          >
            {option}{suffix}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>設定</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* テーマ設定 */}
        {renderSettingItem(
          'テーマ',
          <View style={styles.themeSelector}>
            <Text style={[styles.themeLabel, { color: theme.colors.textSecondary }]}>
              {themeType === 'light' ? 'ライトモード' : 'ダークモード'}
            </Text>
            <Switch
              value={themeType === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={'#fff'}
            />
          </View>
        )}

        {/* 小数点桁数設定 */}
        {renderSettingItem(
          '小数点表示桁数',
          renderNumberSelector(
            decimalPlaces,
            [2, 4, 6, 8, 10, 12],
            saveDecimalPlaces,
            '桁'
          )
        )}

        {/* 履歴保存件数設定 */}
        {renderSettingItem(
          '履歴保存件数',
          renderNumberSelector(
            historyLimit,
            [50, 100, 200, 500, 1000],
            saveHistoryLimit,
            '件'
          )
        )}

        {/* データ管理 */}
        <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>データ管理</Text>
          
          <TouchableOpacity
            style={[styles.dangerButton, { borderColor: theme.colors.error }]}
            onPress={handleClearAllHistory}
          >
            <Text style={[styles.dangerButtonText, { color: theme.colors.error }]}>
              すべての履歴を削除
            </Text>
          </TouchableOpacity>
        </View>

        {/* アプリ情報 */}
        <View style={[styles.section, { borderTopColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>アプリ情報</Text>
          
          {renderSettingItem(
            'バージョン',
            <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>1.0.0</Text>
          )}
          
          {renderSettingItem(
            '開発者',
            <Text style={[styles.developerText, { color: theme.colors.textSecondary }]}>Claude Code</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  settingItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeLabel: {
    fontSize: 14,
  },
  numberSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  numberOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  numberOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 32,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  dangerButton: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 14,
  },
  developerText: {
    fontSize: 14,
  },
});