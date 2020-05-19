import React from 'react';
import { View, Text } from 'react-native';
import Lottie from 'lottie-react-native';
import lottie from '../loaders/dataloading'

function lottieLoading({ navigation }, data, text, color, tcolor) {

    const dataloading = data;
    const datatext = text;
    const datacolor = color;
    const textcolor = tcolor;

    return (

        <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: datacolor }}>
            <Lottie source={lottie.dataloading} style={{ width: 350, height: 350 }} autoPlay loop />
            <Text style={{ textAlign: 'center', color: textcolor, fontSize: 12 }}>{datatext}</Text>
        </View>

    );

}

export default lottieLoading;