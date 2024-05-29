import React from 'react';
import {AppRegistry} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import App from './src/App';

RNBootSplash.hide({fade: true});

AppRegistry.registerComponent('YourProjectName', () => App);