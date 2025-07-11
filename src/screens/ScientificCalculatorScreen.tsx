import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { saveCalculationHistory, formatExpression } from '../utils/historyUtils';

// 科学電卓画面のコンポーネント
export default function ScientificCalculatorScreen() {
  // 計算機の状態管理
  const [display, setDisplay] = useState('0'); // 表示値
  const [previousValue, setPreviousValue] = useState<number | null>(null); // 前の値
  const [operation, setOperation] = useState<string | null>(null); // 演算子
  const [waitingForOperand, setWaitingForOperand] = useState(false); // 次の入力待ち状態
  const [memory, setMemory] = useState<number>(0); // メモリ値

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

  // 科学計算関数
  const performScientificOperation = async (func: string) => {
    const currentValue = parseFloat(display);
    let result: number;
    let functionName: string;

    switch (func) {
      case 'sin':
        result = Math.sin(currentValue * (Math.PI / 180)); // 度をラジアンに変換
        functionName = 'sin';
        break;
      case 'cos':
        result = Math.cos(currentValue * (Math.PI / 180));
        functionName = 'cos';
        break;
      case 'tan':
        result = Math.tan(currentValue * (Math.PI / 180));
        functionName = 'tan';
        break;
      case 'log':
        result = Math.log10(currentValue);
        functionName = 'log';
        break;
      case 'ln':
        result = Math.log(currentValue);
        functionName = 'ln';
        break;
      case 'sqrt':
        result = Math.sqrt(currentValue);
        functionName = '√';
        break;
      case 'square':
        result = currentValue * currentValue;
        functionName = 'x²';
        break;
      case 'factorial':
        result = factorial(Math.floor(currentValue));
        functionName = '!';
        break;
      default:
        result = currentValue;
        functionName = '';
    }

    // 履歴に保存（科学計算関数の場合）
    if (functionName) {
      const expression = `${functionName}(${currentValue})`;
      await saveCalculationHistory(expression, String(result));
    }

    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  // 定数入力
  const inputConstant = (constant: string) => {
    let value: number;
    switch (constant) {
      case 'pi':
        value = Math.PI;
        break;
      case 'e':
        value = Math.E;
        break;
      default:
        value = 0;
    }
    setDisplay(String(value));
    setWaitingForOperand(true);
  };

  // 階乗計算
  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  // メモリ操作
  const memoryOperation = (op: string) => {
    const currentValue = parseFloat(display);
    switch (op) {
      case 'M+':
        setMemory(memory + currentValue);
        break;
      case 'M-':
        setMemory(memory - currentValue);
        break;
      case 'MR':
        setDisplay(String(memory));
        setWaitingForOperand(true);
        break;
      case 'MC':
        setMemory(0);
        break;
    }
  };

  // 演算子ボタンが押された時の処理
  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  // 計算処理
  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '^':
        return Math.pow(firstValue, secondValue);
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
      
      // 履歴に保存
      await saveCalculationHistory(expression, String(newValue));
      
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 表示エリア */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
        {memory !== 0 && <Text style={styles.memoryIndicator}>M</Text>}
      </View>

      {/* 科学計算ボタンエリア */}
      <View style={styles.buttonContainer}>
        {/* 1行目: メモリ操作 */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => memoryOperation('MC')}>
            <Text style={styles.scientificButtonText}>MC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => memoryOperation('MR')}>
            <Text style={styles.scientificButtonText}>MR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => memoryOperation('M+')}>
            <Text style={styles.scientificButtonText}>M+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => memoryOperation('M-')}>
            <Text style={styles.scientificButtonText}>M-</Text>
          </TouchableOpacity>
        </View>

        {/* 2行目: 三角関数 */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => performScientificOperation('sin')}>
            <Text style={styles.scientificButtonText}>sin</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => performScientificOperation('cos')}>
            <Text style={styles.scientificButtonText}>cos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => performScientificOperation('tan')}>
            <Text style={styles.scientificButtonText}>tan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => performScientificOperation('log')}>
            <Text style={styles.scientificButtonText}>log</Text>
          </TouchableOpacity>
        </View>

        {/* 3行目: 対数・ルート・べき乗 */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => performScientificOperation('ln')}>
            <Text style={styles.scientificButtonText}>ln</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => performScientificOperation('sqrt')}>
            <Text style={styles.scientificButtonText}>√</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => performScientificOperation('square')}>
            <Text style={styles.scientificButtonText}>x²</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => performOperation('^')}>
            <Text style={styles.scientificButtonText}>x^y</Text>
          </TouchableOpacity>
        </View>

        {/* 4行目: 定数・階乗 */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => inputConstant('pi')}>
            <Text style={styles.scientificButtonText}>π</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => inputConstant('e')}>
            <Text style={styles.scientificButtonText}>e</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scientificButton]} onPress={() => performScientificOperation('factorial')}>
            <Text style={styles.scientificButtonText}>n!</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.functionButton]} onPress={clear}>
            <Text style={styles.functionButtonText}>AC</Text>
          </TouchableOpacity>
        </View>

        {/* 標準電卓部分 */}
        {/* 5行目: 7, 8, 9, ÷ */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => inputNumber('7')}>
            <Text style={styles.numberButtonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => inputNumber('8')}>
            <Text style={styles.numberButtonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => inputNumber('9')}>
            <Text style={styles.numberButtonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => performOperation('÷')}>
            <Text style={styles.operatorButtonText}>÷</Text>
          </TouchableOpacity>
        </View>

        {/* 6行目: 4, 5, 6, × */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => inputNumber('4')}>
            <Text style={styles.numberButtonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => inputNumber('5')}>
            <Text style={styles.numberButtonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => inputNumber('6')}>
            <Text style={styles.numberButtonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => performOperation('×')}>
            <Text style={styles.operatorButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* 7行目: 1, 2, 3, - */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => inputNumber('1')}>
            <Text style={styles.numberButtonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => inputNumber('2')}>
            <Text style={styles.numberButtonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => inputNumber('3')}>
            <Text style={styles.numberButtonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => performOperation('-')}>
            <Text style={styles.operatorButtonText}>-</Text>
          </TouchableOpacity>
        </View>

        {/* 8行目: 0, ., =, + */}
        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={() => inputNumber('0')}>
            <Text style={styles.numberButtonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.numberButton]} onPress={inputDecimal}>
            <Text style={styles.numberButtonText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={onEqualPress}>
            <Text style={styles.operatorButtonText}>=</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.operatorButton]} onPress={() => performOperation('+')}>
            <Text style={styles.operatorButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  displayContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  displayText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'thin',
  },
  memoryIndicator: {
    fontSize: 16,
    color: '#ff9500',
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberButton: {
    backgroundColor: '#333',
  },
  numberButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  operatorButton: {
    backgroundColor: '#ff9500',
  },
  operatorButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  functionButton: {
    backgroundColor: '#a6a6a6',
  },
  functionButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  scientificButton: {
    backgroundColor: '#666',
  },
  scientificButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});