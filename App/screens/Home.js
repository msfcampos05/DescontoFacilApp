import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  Dimensions,
  useCallback,
} from 'react-native';
import addImage from '../../assets/plusCategory.png';
import * as firebase from 'firebase';

const { width, height } = Dimensions.get("window");


const Home = ({ navigation }) => {

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [dataProducts, setDataProducts] = useState([]);
  const [query, setQuery] = useState(null);

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
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#ff5b77" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Desconto Fácil App</Text>
        </View>
        <View style={styles.header}>
          <TextInput
            placeholder="Pesquisar produto..."
            placeholderTextColor="gray"
            value={query}
            style={styles.input}
          />
        </View>

        <FlatList
          data={dataProducts}
          ItemSeparatorComponent={() => separetor()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (

              <View style={styles.productContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: item.img }}
                />
                <View style={styles.dataContainer}>
                  <Text numberOfLines={1} style={styles.title}>{item.produto}</Text>
                  <Text numberOfLines={5} style={styles.description} >{item.descricao}</Text>
                  <Text style={styles.price}>{item.valor}</Text>
                </View>

              </View>)


          }}

        />
      </View>
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
    backgroundColor: "#fff",
  },
  header: {
    height: 50,
    width: "100%",
    backgroundColor: "#ff5b77",
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'

  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color:"#fff",
    fontWeight: "bold",
  },
  input: {
    height: 30,
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    paddingLeft: 10,
  },
  Image: {
    width: 20,
    height: 23,
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
  dataContainer: {
    padding: 10,
    paddingTop: 5,
    width: width - 100

  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000"
  },
  description: {
    fontSize: 12,
    color: "gray",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000"
  }
});

export default Home;