import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements';
import addImage from '../../assets/plusCategory.png';
import * as firebase from 'firebase';
import SearchBar from './searchBar';

const {width,height} = Dimensions.get("window");

const Home = ({ navigation }) => {

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [dataProducts, setDataProducts] = useState([]);

  useEffect(() => {

    firebase.firestore()
      .collection('products')
      .onSnapshot(querySnapshot => {
        const list = [];
        querySnapshot.forEach(doc => {
          const { descricao, img, produto, valor } = doc.data();
          list.push({
            id: doc.id,
            descricao,
            img,
            produto,
            valor
          });
        });

        setDataProducts(list);

        if (loading) {
          setLoading(false);
        }
      });

  }, []);


  function deleteItemById(id) {
    Alert.alert(
      'Deseja apagar essa troca?',
      'Está ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => handleDelete(id) },
      ],
      { cancelable: false }
    )

  }

  function handleDelete(id) {


  };

  const separetor = () => {
    return (
      <View style={{ height: 10, width: "180%", backgroundColor: "#e5e5e5" }} />
    )
  }

  return (

    <>
      <FlatList
        data={dataProducts}
        ItemSeparatorComponent={() => separetor()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) =>
          <TouchableOpacity onLongPress={() => deleteItemById(item.id)}>
            <View style={styles.productContainer}>
              <Image
                style={styles.image}
                source={{ uri: item.img }}
              />
              <View style={styles.dataContainer}>
                <Text numberOfLines={1} style={styles.title}>{item.produto}</Text>
                <Text numberOfLines={3} style={styles.description} >{item.descricao}</Text>
                <Text style={styles.price}>{item.valor}</Text>
              </View>

            </View>
          </TouchableOpacity>

        }

      />

      <View>
        <TouchableOpacity style={styles.addButton}>
          <View style={styles.ViewiButton}>
            <Image style={styles.Image} source={addImage} />
          </View>
        </TouchableOpacity>
      </View>

    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  Image: {
    width: 20,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ViewiButton: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButton: {
    position: 'absolute',
    backgroundColor: '#FFFCFC',
    elevation: 4,
    borderRadius: 100,
    height: 57,
    width: 58,
    right: 15,
    bottom: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  productContainer: {
    flexDirection: "row",
    padding: 5,
  },
  image: {
    height: 120,
    width: 120,
  },
  dataContainer:{
    padding: 10,
    paddingTop: 5,
    
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000"
  }
});

export default Home;