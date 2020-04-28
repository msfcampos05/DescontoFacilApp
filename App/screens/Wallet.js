import React from "react";
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


export default ({ navigation }) => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#ff5b77" />
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Meus Cupons</Text>
    </View>
  </View>
);

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

});
