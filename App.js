import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/config/Navigation';

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});