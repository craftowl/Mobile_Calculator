import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import {
  saveCalculationHistory,
  formatExpression,
} from '../utils/historyUtils';
import { RootTabParamList } from '../types/navigation';
import { useTheme } from '../contexts/ThemeContext';
import { AnimatedButton } from '../components/AnimatedButton';
import { formatNumber, getDecimalPlaces } from '../utils/settingsUtils';

type StandardCalculatorScreenRouteProp = RouteProp<
  RootTabParamList,
  'Standard'
>;

// 標準電卓画面のコンポーネント
export default function StandardCalculatorScreen() {
  const route = useRoute<StandardCalculatorScreenRouteProp>();
  const { theme } = useTheme();

  // 計算機の状態管理
  const [display, setDisplay] = useState('0'); // 表示値
  const [previousValue, setPreviousValue] = useState<number | null>(null); // 前の値
  const [operation, setOperation] = useState<string | null>(null); // 演算子
  const [waitingForOperand, setWaitingForOperand] = useState(false); // 次の入力待ち状態
  const [decimalPlaces, setDecimalPlacesState] = useState(10); // 小数点桁数設定

  // 小数点桁数設定を読み込み
  useEffect(() => {
    const loadDecimalPlaces = async () => {
      const places = await getDecimalPlaces();
      setDecimalPlacesState(places);
    };
    loadDecimalPlaces();
  }, []);

  // 履歴からの再計算値を受け取った時の処理
  useEffect(() => {
    if (route.params?.recalculateValue) {
      setDisplay(route.params.recalculateValue);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  }, [route.params?.recalculateValue]);

  // 数字ボタンが押された時の処理
  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  // 小数点ボタンが押された時の処理
  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  // クリアボタンが押された時の処理
  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  // 演算子ボタンが押された時の処理
  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(formatNumber(newValue, decimalPlaces));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  // 計算処理
  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string
  ): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      default:
        return secondValue;
    }
  };

  // イコールボタンが押された時の処理
  const onEqualPress = async () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const expression = formatExpression(previousValue, operation, display);
      const formattedResult = formatNumber(newValue, decimalPlaces);

      // 履歴に保存
      await saveCalculationHistory(expression, formattedResult);

      setDisplay(formattedResult);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* 表示エリア */}
      <View style={styles.displayContainer}>
        <Text style={[styles.displayText, { color: theme.colors.text }]}>
          {display}
        </Text>
      </View>

      {/* ボタンエリア */}
      <View style={styles.buttonContainer}>
        {/* 1行目: AC, +/-, %, ÷ */}
        <View style={styles.row}>
          <AnimatedButton title="AC" onPress={clear} type="function" />
          <AnimatedButton title="+/-" onPress={() => {}} type="function" />
          <AnimatedButton title="%" onPress={() => {}} type="function" />
          <AnimatedButton
            title="÷"
            onPress={() => performOperation('÷')}
            type="operator"
          />
        </View>

        {/* 2行目: 7, 8, 9, × */}
        <View style={styles.row}>
          <AnimatedButton
            title="7"
            onPress={() => inputNumber('7')}
            type="number"
          />
          <AnimatedButton
            title="8"
            onPress={() => inputNumber('8')}
            type="number"
          />
          <AnimatedButton
            title="9"
            onPress={() => inputNumber('9')}
            type="number"
          />
          <AnimatedButton
            title="×"
            onPress={() => performOperation('×')}
            type="operator"
          />
        </View>

        {/* 3行目: 4, 5, 6, - */}
        <View style={styles.row}>
          <AnimatedButton
            title="4"
            onPress={() => inputNumber('4')}
            type="number"
          />
          <AnimatedButton
            title="5"
            onPress={() => inputNumber('5')}
            type="number"
          />
          <AnimatedButton
            title="6"
            onPress={() => inputNumber('6')}
            type="number"
          />
          <AnimatedButton
            title="-"
            onPress={() => performOperation('-')}
            type="operator"
          />
        </View>

        {/* 4行目: 1, 2, 3, + */}
        <View style={styles.row}>
          <AnimatedButton
            title="1"
            onPress={() => inputNumber('1')}
            type="number"
          />
          <AnimatedButton
            title="2"
            onPress={() => inputNumber('2')}
            type="number"
          />
          <AnimatedButton
            title="3"
            onPress={() => inputNumber('3')}
            type="number"
          />
          <AnimatedButton
            title="+"
            onPress={() => performOperation('+')}
            type="operator"
          />
        </View>

        {/* 5行目: 0, ., = */}
        <View style={styles.row}>
          <AnimatedButton
            title="0"
            onPress={() => inputNumber('0')}
            type="number"
            style={styles.zeroButton}
          />
          <AnimatedButton title="." onPress={inputDecimal} type="number" />
          <AnimatedButton title="=" onPress={onEqualPress} type="operator" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  displayText: {
    fontSize: 64,
    fontWeight: 'thin',
  },
  buttonContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  zeroButton: {
    width: 170,
    borderRadius: 40,
  },
});
