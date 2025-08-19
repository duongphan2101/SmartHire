import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// import HomeScreen from '../mobile/src/screens/HomeScreen';
//import LoginScreen from '../mobile/src/screens/LoginScreen';
import RegisterScreen from '../mobile/src/screens/RegisterScreen';
function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* <LoginScreen /> */}
      <RegisterScreen />
      {/* <HomeScreen /> */}
    </SafeAreaProvider>
  );
}

export default App;
