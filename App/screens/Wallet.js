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
import * as firebase from 'firebase';
const { width, height } = Dimensions.get('window');
//import qrCodejs from '../Components/qrcode';

export default class Wallet extends Component {

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

  
  generateQrCode(){

  }

  handledeleteItembyId(id) {
    firebase.firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection('wallet')
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
        { text: 'Confirmar',onPress: () => this. handledeleteItembyId(id) },
      ],
      { cancelable: false }
    )

  }
  getFirebaseData() {

    firebase.firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .collection('wallet')
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
    this.getFirebaseData();
    this.setState({
      dataBackup: this.dataPd,
      dataSource: this.dataPd,
    })

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
               >
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
