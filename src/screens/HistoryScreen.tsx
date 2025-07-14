import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import {
  getCalculationHistory,
  deleteHistoryItem as deleteHistoryItemUtil,
  clearAllHistory as clearAllHistoryUtil,
  CalculationHistory,
} from '../utils/historyUtils';
import { RootTabParamList } from '../types/navigation';

// 履歴画面のコンポーネント
export default function HistoryScreen() {
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const { theme } = useTheme();

  // 画面がフォーカスされた時に履歴を読み込み（タブ切り替え時に更新）
  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  // AsyncStorageから履歴を読み込む
  const loadHistory = async () => {
    try {
      const savedHistory = await getCalculationHistory();
      setHistory(savedHistory);
    } catch (error) {
      console.error('履歴の読み込みに失敗しました:', error);
    }
  };

  // 履歴項目をタップした時の処理（再計算機能）
  const onHistoryItemPress = (item: CalculationHistory) => {
    // 標準電卓画面に遷移して、結果を設定
    navigation.navigate('Standard', {
      recalculateValue: item.result,
    });
  };

  // 履歴項目を削除
  const deleteHistoryItem = (id: string) => {
    Alert.alert('削除確認', 'この履歴項目を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('削除開始 - ID:', id);
            await deleteHistoryItemUtil(id);
            console.log('削除完了、履歴を再読み込み');
            await loadHistory(); // 履歴を再読み込み
          } catch (error) {
            console.error('履歴削除でエラーが発生:', error);
            Alert.alert('エラー', '履歴の削除に失敗しました。');
          }
        },
      },
    ]);
  };

  // 全履歴を削除
  const clearAllHistory = () => {
    Alert.alert(
      '全削除確認',
      'すべての履歴を削除しますか？この操作は取り消せません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '全削除',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('全履歴削除開始');
              await clearAllHistoryUtil();
              console.log('全履歴削除完了');
              setHistory([]);
            } catch (error) {
              console.error('全履歴削除でエラーが発生:', error);
              Alert.alert('エラー', '履歴の削除に失敗しました。');
            }
          },
        },
      ]
    );
  };

  // 日時フォーマット関数
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes}分前`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}時間前`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}日前`;
    } else {
      return new Date(date).toLocaleDateString('ja-JP');
    }
  };

  // 履歴項目をレンダリング
  const renderHistoryItem = ({ item }: { item: CalculationHistory }) => (
    <TouchableOpacity
      style={[styles.historyItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => onHistoryItemPress(item)}
      onLongPress={() => deleteHistoryItem(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.historyContent}>
        <Text
          style={[styles.expressionText, { color: theme.colors.textSecondary }]}
        >
          {item.expression}
        </Text>
        <Text style={[styles.resultText, { color: theme.colors.text }]}>
          = {item.result}
        </Text>
      </View>
      <Text
        style={[styles.timestampText, { color: theme.colors.textSecondary }]}
      >
        {formatDate(item.timestamp)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          計算履歴
        </Text>
        {history.length > 0 && (
          <TouchableOpacity
            onPress={clearAllHistory}
            style={[
              styles.clearButton,
              { backgroundColor: theme.colors.error },
            ]}
          >
            <Text style={styles.clearButtonText}>全削除</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 履歴リスト */}
      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text
            style={[styles.emptyText, { color: theme.colors.textSecondary }]}
          >
            履歴がありません
          </Text>
          <Text
            style={[styles.emptySubText, { color: theme.colors.textSecondary }]}
          >
            計算を行うと履歴が表示されます
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* 操作説明 */}
      {history.length > 0 && (
        <View
          style={[
            styles.instructionContainer,
            { borderTopColor: theme.colors.border },
          ]}
        >
          <Text
            style={[
              styles.instructionText,
              { color: theme.colors.textSecondary },
            ]}
          >
            タップで再利用 · 長押しで削除
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyItem: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyContent: {
    flex: 1,
  },
  expressionText: {
    fontSize: 16,
    marginBottom: 4,
  },
  resultText: {
    fontSize: 20,
    fontWeight: '600',
  },
  timestampText: {
    fontSize: 12,
    marginLeft: 16,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  instructionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  instructionText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
