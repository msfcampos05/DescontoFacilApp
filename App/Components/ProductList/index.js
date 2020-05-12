/* Core */
import React, { Component } from 'react';

/* Presentational */
import { View, Text, Image } from 'react-native';

import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';

const Product = ({ data: { img, descricao, id, valor, produto } }) => (
  
  <View style={styles.container}>

    <View style={styles.imageContainer}>
      <Image source={{ uri: img }} style={styles.image} />
    </View>

    <View style={styles.separatorContainer}>

      <Text style={styles.title}>{produto}</Text>
      <Text style={styles.price}>{valor}</Text>
      <Text style={styles.priceOff}>{valor}</Text>

    </View>

  </View>
);

export default Product;