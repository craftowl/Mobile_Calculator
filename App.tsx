import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// 画面コンポーネントのインポート
import StandardCalculatorScreen from './src/screens/StandardCalculatorScreen';
import ScientificCalculatorScreen from './src/screens/ScientificCalculatorScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// テーマプロバイダーのインポート
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

// タブナビゲーターの作成
const Tab = createBottomTabNavigator();

// ナビゲーターコンポーネント（テーマを使用）
function AppNavigator() {
  const { theme, themeType } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar style={themeType === 'dark' ? 'light' : 'dark'} />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopColor: theme.colors.border,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        {/* 標準電卓タブ */}
        <Tab.Screen
          name="Standard"
          component={StandardCalculatorScreen}
          options={{
            tabBarLabel: '標準',
            tabBarIcon: ({ color, size }) => (
              <CalculatorIcon color={color} size={size} />
            ),
          }}
        />

        {/* 科学電卓タブ */}
        <Tab.Screen
          name="Scientific"
          component={ScientificCalculatorScreen}
          options={{
            tabBarLabel: '科学',
            tabBarIcon: ({ color, size }) => (
              <ScientificIcon color={color} size={size} />
            ),
          }}
        />

        {/* 履歴タブ */}
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarLabel: '履歴',
            tabBarIcon: ({ color, size }) => (
              <HistoryIcon color={color} size={size} />
            ),
          }}
        />

        {/* 設定タブ */}
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: '設定',
            tabBarIcon: ({ color, size }) => (
              <SettingsIcon color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// メインアプリケーションコンポーネント
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

// タブアイコンコンポーネント（絵文字を使用）
const CalculatorIcon = ({ color, size }: { color: string; size: number }) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>📱</Text>
  </View>
);

const ScientificIcon = ({ color, size }: { color: string; size: number }) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>🔬</Text>
  </View>
);

const HistoryIcon = ({ color, size }: { color: string; size: number }) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>📋</Text>
  </View>
);

const SettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <View
    style={{
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{ fontSize: size * 0.8, color }}>⚙️</Text>
  </View>
);
