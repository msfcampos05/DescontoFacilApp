import React, { Component, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Button,
  StatusBar
} from 'react-native';
import * as firebase from 'firebase';

function DetailsScreen ({ route, navigation }) {

  /* 2. Get the param */
  const { itemId } = route.params;
  const { itemName } = route.params;
  const { itemPrice } = route.params;
  const { itemDescription } = route.params;
  const { itemImg } = route.params;

  async function clickEventListener() {

    console.log(itemName)
        await firebase.firestore()
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .collection('wallet')
                .doc(itemId)
                .set({
                    produto: itemName,
                    descricao: itemDescription,
                    valor:'R$ '+ itemPrice,
                    img: itemImg,
                    valid: '3'
                })
                .then(function () {
                  Alert.alert("Sucesso", "Cupom adicionado a carteira")
                })
                .catch(function (error){
                  Alert.alert("Desculpe", "Houve um erro " + error)
                });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff5b77" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Desconto Fácil App</Text>
      </View>
      <ScrollView>
        <View style={{ alignItems: 'center', marginHorizontal: 30 }}>
          <Image resizeMode="contain" style={styles.productImg} source={{ uri: itemImg}} />
          <Text style={styles.name}>{(itemName)}</Text>
          <Text style={styles.price}>{(itemPrice)}</Text>
          <Text style={styles.description}>{(itemDescription)}</Text>
        </View>
        <View style={styles.separator}></View>
        <View style={styles.addToCarContainer}>
          <TouchableOpacity style={styles.shareButton} onPress={clickEventListener}>
            <Text style={styles.shareButtonText}>Adicionar a Carteira</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    height: 60,
    width: '100%',
    backgroundColor: '#ff5b77',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
    fontWeight: "bold",
  },
  productImg: {
    width: 200,
    height: 200,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: 'bold'
  },
  price: {
    marginTop: 10,
    fontSize: 18,
    color: "green",
    fontWeight: 'bold'
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
    color: "#696969",
  },
  separator: {
    height: 2,
    backgroundColor: "#eeeeee",
    marginTop: 20,
    marginHorizontal: 30
  },
  shareButton: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: "#ff5b77",
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  addToCarContainer: {
    marginHorizontal: 30
  }
});

export default DetailsScreen;