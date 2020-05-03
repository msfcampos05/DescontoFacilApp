import React, { useState, useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import Lottie from 'lottie-react-native';
import dataloading from '../Components/loaders/selfie.json';

function Loading({ navigation }) {

  return (

    <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center',backgroundColor: '#ffff' }}>
      <StatusBar
        hidden={true}
        translucent={false}
        animated={true} 
        backgroundColor='#ffff'
      />
      <Lottie source={dataloading} style={{ width: 450, height: 450 }} autoPlay loop />
    </View>

  );


}

export default Loading;