import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView
} from 'react-native';
import addImage from '../../assets/plusCategory.png';
import * as firebase from 'firebase';
import Lottie from 'lottie-react-native';
import deleteLoading from '../Components/loaders/check.json';
import Product from '../Components/ProductList';
import LoadingComponent from '../Components/defaultLoading/lottieLoading';
import HomeLoading from '../Components/loaders/main-feed-page.json'

console.disableYellowBox = true;

export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      query: null,
      loadingDelete: false,
      data: [],
      loadingList: false,
      barIcon: 'https://img.icons8.com/ios/100/000000/search--v1.png'
    };

    this.dataBackup = [];
  }

  //add item to wallet 
  handledeleteItembyId = async (id) => {

    this.setState({ loadingDelete: true });

    await firebase.firestore()
      .collection("products")
      .doc(id)
      .delete().then(() => {
        this.setState({ loadingDelete: false });
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
        { text: 'Confirmar', onPress: () => this.handledeleteItembyId(id) },
      ],
      { cancelable: false }
    )

  }

  //Get user info from firebase
  getFirebaseData = async () => {

    await firebase.firestore()
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
        this.dataBackup = list;

        this.setState({
          data: list,
        })

        if (this.loadingList) {
          this.setState({
            loadingList: false
          })
        }
      });
  }

  //Mount component 
  componentDidMount() {
    console.log(firebase.auth().currentUser.photoURL)
    var Unmount;

    Unmount = this.getFirebaseData().then(() => {
      this.setState({ loadingList: true });
    }
    
    );

    this.componentWillUnmount(Unmount)
  }


  componentWillUnmount(Unmount) {
    Unmount;
  }

  //SearchBar working 
  filterItem = event => {

    //Armazena texto do input search
    var text = event.nativeEvent.text;
    if (text == '') {
      this.setState({
        barIcon: 'https://img.icons8.com/ios/100/000000/search--v1.png'
      })
    } else {
      this.setState({
        barIcon: 'https://img.icons8.com/ios/50/000000/left.png'
      })
    }

    this.setState({
      query: text,
    });

    const newData = this.dataBackup.filter(item => {
      const itemData = `${item.produto.toUpperCase()} ${item.descricao.toUpperCase()} ${item.valor.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({
      data: newData,
    });

  };

  searchIconBack = () => {

    if (this.state.barIcon == 'https://img.icons8.com/ios/50/000000/left.png') {
      this.setState({
        barIcon: 'https://img.icons8.com/ios/100/000000/search--v1.png',
        query: null
      })
      this.getFirebaseData();
    }

  }

  _loadingView() {
    const SelectLoading = null;
    this.state.loadingList ? SelectLoading = HomeLoading : this.state.loadingList ? SelectLoading = deleteLoading : SelectLoading = null;
   
    return( <LoadingComponent data={SelectLoading}/> )

  }

  _renderItens() {

    const { navigation } = this.props;

    return(
      <View style={styles.ProductContainer}>

      {this.state.data.map(data =>
        <TouchableOpacity
          onLongPress={() => this.addItemWalletById(data.id)}
          onPress={() => {
            navigation.push('ProductDetails', {
              itemId: data.id,
              itemName: data.produto,
              itemPrice: data.valor,
              itemImg: data.img,
              itemDescription: data.descricao,
            })
          }}>
          <Product key={data.id} data={data} />
        </TouchableOpacity>
      )}
    </View>
    )
  }

  //Render 
  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.container}>

        <StatusBar barStyle="light-content" backgroundColor="#ff5b77" />

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Desconto Fácil App</Text>
        </View>

        <ScrollView>
          <View style={styles.header}>
            <View style={styles.SectionStyle}>
              <TouchableOpacity onPress={() => this.searchIconBack()}>
                <Image
                  //We are showing the Image from online
                  source={{ uri: this.state.barIcon }}
                  //Image Style
                  style={styles.ImageStyle}
                />
              </TouchableOpacity>
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
          {this.state.loading ? this._loadingView() : this._renderItens()

          }

        </ScrollView>

        <TouchableOpacity style={styles.addButton} onPress={() => navigation.push('addProducts')}>
          <View style={styles.ViewiButton}>
            <Image style={styles.Image} source={addImage} />
          </View>
        </TouchableOpacity>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8fa",
  },
  ProductContainer: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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










