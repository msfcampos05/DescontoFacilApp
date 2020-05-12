/* Core */
import React, { Component } from 'react';

/* Presentational */
import { View, Text, Image } from 'react-native';

import styles from './styles';

const Product = ({ data: { img, descricao, id, valor, produto } }) => (
  
  <View style={styles.container}>
    <Image source={{ uri: img }} style={styles.image} />

    <View style={styles.separatorContainer}>

      <Text style={styles.title}>{produto}</Text>
      <Text style={styles.price}>{valor}</Text>
      <Text style={styles.priceOff}>{valor}</Text>

    </View>

  </View>
);

export default Product;