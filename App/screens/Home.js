import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import addImage from '../../assets/plusCategory.png';
import * as firebase from 'firebase';
const { width, height } = Dimensions.get('window');

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: null,
      dataSource: [],
      dataBackup: [],
      loading: true,
      dataPd: [],
    };
  }

  //Alert to confirm add item to wallet
  AlertBuilding() {
    Alert.alert(
      'Página em construção',
      'Página de detalhes do produto em construção!',
      [
        { text: 'Fechar', style: 'cancel' },
      ],
      { cancelable: false }
    )

  }
  //add item to wallet 
  handledeleteItembyId(id) {
    firebase.firestore()
      .collection("products")
      .doc(id)
      .delete().then(function () {
        console.log("Document successfully deleted!");
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });
  }

  //Alert to confirm add item to wallet
  addItemWalletById(id) {
    Alert.alert(
      'Deseja excuir o cupom?',
      'Esta ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: () => this. handledeleteItembyId(id) },
      ],
      { cancelable: false }
    )

  }
  getFirebaseData() {

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

        this.setState({
          dataPd: list,
        })

        if (this.loading) {
          this.setState({
            loading: false
          })
        }
      });
  }
  componentDidMount() {
    console.log(firebase.auth().currentUser.photoURL)
    var Unmount;
    Unmount = this.getFirebaseData();
    this.componentWillUnmount(Unmount)
  }
  componentWillUnmount(Unmount){
    Unmount;
  }
  filterItem = event => {

    var query = event.nativeEvent.text;
    this.setState({
      query: query,
    });
    
    if (query == '') {
      this.setState({
        dataSource: this.state.dataBackup,
      });
      console.log(dataSource);
    } else {
      var data = this.state.dataBackup;
      query = query.toLowerCase();
      data = data.filter(l => l.produto.toLowerCase().match(query));

      this.setState({
        dataSource: data,
      });
    }
  };

  separator = () => {
    return (
      <View style={{ height: 5, width: '100%', backgroundColor: '#e5e5e5' }} />
    );
  };

  render() {
    const { navigation } = this.props;
    console.disableYellowBox = true;
    return (
      <View style={styles.container}>

        <StatusBar barStyle="light-content" backgroundColor="#ff5b77" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Desconto Fácil App</Text>
        </View>

        <View style={styles.header}>
          <View style={styles.SectionStyle}>
            <Image
              //We are showing the Image from online
              source={{ uri: 'https://img.icons8.com/ios/100/000000/search--v1.png', }}
              //Image Style
              style={styles.ImageStyle}
            />
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="O que procura..."
              placeholderTextColor="gray"
              value={this.state.query}
              onChange={this.filterItem.bind(this)}
              style={styles.input}
            />
          </View>
        </View>

        <FlatList
          data={this.state.dataPd}
          ItemSeparatorComponent={() => this.separator()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onLongPress={() => this.addItemWalletById(item.id)}
                onPress={() => {
                  navigation.push('ProductDetails', {
                    itemId: item.id,
                    itemName: item.produto,
                    itemPrice: item.valor,
                    itemImg: item.img,
                    itemDescription: item.descricao,
                  })
                }}>
                <View style={styles.productContainer}>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={{ uri: item.img }}
                  />
                  <View style={styles.dataContainer}>
                    <Text numberOfLines={1} style={styles.title}>
                      {item.produto}
                    </Text>
                    <Text numberOfLines={8} style={styles.description}>
                      {item.descricao}
                    </Text>
                    <Text style={styles.price}>{item.valor}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <View>
          <TouchableOpacity style={styles.addButton} onPress={()=> navigation.push('addProducts')}>
            <View style={styles.ViewiButton}>
              <Image style={styles.Image} source={addImage} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  input: {
    height: 40,
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    paddingLeft: 10,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 40,
    borderRadius: 20,
    margin: 10,
  },

  ImageStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  productContainer: {
    flexDirection: 'row',
    padding: 2,
  },
  image: {
    height: 150,
    width: 90,
    alignSelf: "center"
  },
  dataContainer: {
    padding: 5,
    paddingTop: 5,
    width: width - 100,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000"
  },
  description: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'justify',
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000"
  },
  Image: {
    width: 20,
    height: 23,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButton: {
    position: 'absolute',
    backgroundColor: '#ff5b77',
    elevation: 4,
    borderRadius: 100,
    height: 57,
    width: 58,
    right: 15,
    bottom: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
});












/*
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
  Modal,
  Icon
} from 'react-native';
import addImage from '../../assets/plusCategory.png';
import * as firebase from 'firebase';

const { width, height } = Dimensions.get("window");


const Home = ({ navigation }) => {

  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [data, setdata] = useState([]);
  const [query, setQuery] = useState(null);
  const [modalVisible, setmodalVisible] = useState(false);

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

        setdata(list);

        if (loading) {
          setLoading(false);
        }
      });

  }, []);


  function addItemWalletById(id) {
    Alert.alert(
      'Adicionar o cupom a carteira?',
      'O desconto será adicionado a sua carteira de cupons!',
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
      <View style={{ height: 5, width: "180%", backgroundColor: "#e5e5e5" }} />
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
        <View style={styles.flatContainer}>
          <FlatList
            data={data}
            ItemSeparatorComponent={() => separetor()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity onLongPress={() => addItemWalletById(item.id)} onPress={() => { navigation.push('productInfo') }}>

                  <View style={styles.productContainer}>
                    <Image
                      resizeMode="contain"
                      style={styles.image}
                      source={{ uri: item.img }}
                    />
                    <View resizeMode="contain" style={styles.dataContainer}>
                      <Text numberOfLines={1} style={styles.title}>{item.produto}</Text>
                      <Text numberOfLines={6} style={styles.description} >{item.descricao}</Text>
                      <Text style={styles.price}>{item.valor}</Text>
                    </View>

                  </View>
                </TouchableOpacity>
              )
            }}

          />
        </View>
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
    flexGrow: 1,
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
    color: "#fff",
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
    height: 100,
    width: 100,
    alignSelf: "center"
  },
  dataContainer: {
    padding: 10,
    paddingTop: 5,
    width: width - 100

  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000"
  },
  description: {
    fontSize: 12,
    color: "gray",
    textAlign: 'justify',
    flexShrink: 1
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000"
  }
});

export default Home;

*/