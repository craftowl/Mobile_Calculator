import React from 'react';
import { StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../contexts/ThemeContext';

// アニメーション付きボタンのProps型
interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  type?: 'number' | 'operator' | 'function';
  disabled?: boolean;
}

// アニメーション付きボタンコンポーネント
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  type = 'number',
  disabled = false,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  // ボタンタイプに応じたスタイルを取得
  const getButtonStyle = () => {
    switch (type) {
      case 'operator':
        return {
          backgroundColor: theme.colors.primary,
          ...styles.operatorButton,
        };
      case 'function':
        return {
          backgroundColor: theme.colors.secondary,
          ...styles.functionButton,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
          ...styles.numberButton,
        };
    }
  };

  // テキストスタイルを取得
  const getTextStyle = () => {
    switch (type) {
      case 'operator':
        return {
          color: '#fff',
          ...styles.operatorButtonText,
        };
      case 'function':
        return {
          color: theme.colors.text,
          ...styles.functionButtonText,
        };
      default:
        return {
          color: theme.colors.text,
          ...styles.numberButtonText,
        };
    }
  };

  // タップジェスチャー
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      if (!disabled) {
        scale.value = withSpring(0.95, { duration: 100 });
        opacity.value = withSpring(0.8, { duration: 100 });
      }
    })
    .onFinalize(() => {
      if (!disabled) {
        scale.value = withSpring(1, { duration: 150 });
        opacity.value = withSpring(1, { duration: 150 });
        runOnJS(onPress)();
      }
    });

  // アニメーションスタイル
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={[
          styles.button,
          getButtonStyle(),
          style,
          animatedStyle,
          disabled && styles.disabled,
        ]}
      >
        <Text
          style={[getTextStyle(), textStyle, disabled && styles.disabledText]}
        >
          {title}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  numberButton: {
    // ベーススタイルは getButtonStyle() で設定
  },
  operatorButton: {
    // ベーススタイルは getButtonStyle() で設定
  },
  functionButton: {
    // ベーススタイルは getButtonStyle() で設定
  },
  numberButtonText: {
    fontSize: 32,
    fontWeight: '400',
  },
  operatorButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  functionButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});
