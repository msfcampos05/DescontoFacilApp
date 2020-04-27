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


} from 'react-native';

import { Icon } from 'react-native-elements';
import addImage from '../../assets/plusCategory.png';

import * as firebase from 'firebase';

const Home = ({ navigation }) => {

  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]); // Initial empty array of users
  const [loading, setLoading] = useState(true); // Set loading to true on component mount

  // On load, fetch our users and subscribe to updates
  useEffect(() => {

    const currentUser = firebase.auth().currentUser;
    const firestoreRef = firebase.firestore().collection("users").doc(currentUser.uid);
    setUser(currentUser);

    const unsubscribe = firestoreRef
      .collection("trocas")
      .onSnapshot((querySnapshot) => {
        // Add users into an array
        const users = querySnapshot.docs.map((documentSnapshot) => {
          return {
            ...documentSnapshot.data(),
            key: documentSnapshot.id, // required for FlatList
          };
        });

        // Update state with the users array
        setUsers(users);

        // As this can trigger multiple times, only update loading after the first update
        if (loading) {
          setLoading(false);
        }
      });

    return () => unsubscribe(); // Stop listening for updates whenever the component unmounts

  }, []);

  if (loading) {
    return null; // Show a loading spinner
  }

  function handleSubmit() {

      //NAVEGAR PARA PAGINA ADICIONAR
  };


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

    firebase.firestore()
      .collection("users")
      .doc(auth().currentUser.uid)
      .collection("trocas")
      .doc(id)
      .delete().then(function () {
        console.log("Document successfully deleted!");
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });

  };


  return (
    <>
      <SafeAreaView style={styles.container}>

        <StatusBar
          hidden={false}
          translucent={false}
          animated={true}
          barStyle={'light-content'}
          backgroundColor='#694fad'
        />

        <FlatList style={styles.flatList}
          data={users}
          renderItem={
            ({ item }) =>
              <TouchableOpacity onLongPress={() => deleteItemById(item.key)}>

                <View style={styles.row}>

                  <Icon
                    name={item.icon}
                    color='#517'
                    type='ionicon'
                  />
                  <View style={styles.textInfo}>
                    <Text style={styles.textItemTroca}>{item.name}</Text>
                    <Text style={styles.textItemData}>{item.date}</Text>
                    <Text style={styles.textItemData}>Expira dia {item.pago}</Text>
                  </View>

                  <Text style={styles.textTurn}>{item.turno}</Text>

                </View>
              </TouchableOpacity>

          }

        />

      </SafeAreaView>
      <View>
        <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
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
    padding: 8,
    flexDirection: 'column', // main axis
    justifyContent: 'center', // main axis
    alignItems: 'center', // cross axis
    backgroundColor: '#fffa'
  },
  tittle: {
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    fontSize: 18,
    textAlign: 'center'
  },
  row: {
    elevation: 1,
    borderRadius: 2,
    backgroundColor: '#ffff',
    flexDirection: 'row',  // main axis
    justifyContent: 'flex-start', // main axis
    alignItems: 'center', // cross axis
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 18,
    paddingRight: 26,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
    flex: 1
  },
  textInfo: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 10
  },
  textItemData: {
    color: '#000',
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: 12,

  }, textItemTroca: {
    color: '#f90',
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: 0,
    fontSize: 20,

  }, textTurn: {
    color: '#f90',
    paddingRight: 10,
    paddingLeft: 5,
    flex: 0,
    fontSize: 16,

  },
  flatList: {
    marginTop: 14,
    alignSelf: "stretch",
  },
  textItem: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginBottom: 15,
    color: '#fff'
  },
  dataView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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

});

export default Home;