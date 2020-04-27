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
import SearchBar from './searchBar';


async function getProducts() {

  firebase.firestore
    .collection('products')
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        if (doc && doc.exists) {
          console.log(doc.id, ' => ', doc.data());
          setProducts(doc.data());

        }
      });
    });

}

const Home = ({ navigation }) => {

  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]); // Initial empty array of users
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [Products, setProducts] = useState([]);

  // On load, fetch our users and subscribe to updates
  useEffect(() => {

    getProducts();

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

    firestore()
      .collection("products")
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
      <SearchBar />
      <Text>
        {Products.id}
      </Text>
      <FlatList
        data={Products}
        showsVerticalScrollIndicator={false}
        renderItem={
          ({ item }) =>
            <TouchableOpacity onLongPress={() => deleteItemById(doc.id)}>
              <View style={styles.feedItem}>
                <Image source={item.avatar} style={styles.avatar} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
                    </View>

                    <Ionicons name="ios-more" size={24} color="#73788B" />
                  </View>
                  <Text style={styles.post}>{item.text}</Text>
                  <Image source={post.image} style={styles.postImage} resizeMode="cover" />
                  <View style={{ flexDirection: "row" }}>
                    <Ionicons name="ios-heart-empty" size={24} color="#73788B" style={{ marginRight: 16 }} />
                    <Ionicons name="ios-chatboxes" size={24} color="#73788B" />
                  </View>
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
    backgroundColor: "#EBECF4"
  },
  header: {
    paddingTop: 64,
    paddingBottom: 16,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EBECF4",
    shadowColor: "#454D65",
    shadowOffset: { height: 5 },
    shadowRadius: 15,
    shadowOpacity: 0.2,
    zIndex: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500"
  },
  feed: {
    marginHorizontal: 16
  },
  feedItem: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 8,
    flexDirection: "row",
    marginVertical: 8
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 16
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: "#454D65"
  },
  timestamp: {
    fontSize: 11,
    color: "#C4C6CE",
    marginTop: 4
  },
  post: {
    marginTop: 16,
    fontSize: 14,
    color: "#838899"
  },
  postImage: {
    width: undefined,
    height: 150,
    borderRadius: 5,
    marginVertical: 16
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