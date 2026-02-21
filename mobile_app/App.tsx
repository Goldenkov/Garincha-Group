import React from 'react';
import { RootNavigator } from '@/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';

const App: React.FC = () => (
  <>
    <StatusBar style="dark" />
    <RootNavigator />
  </>
);

export default App;
