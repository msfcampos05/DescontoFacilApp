import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import 'react-native-gesture-handler';

import LoginScreen from "../screens/Login";
import Loading from "../screens/Loading";
import HomeScreen from "../screens/Home";
import ProfileScreen from "../screens/Profile";
import WalletScreen from "../screens/Wallet";
import ProductScreen from "../screens/productInfo";

import "firebase/auth";
import * as firebase from 'firebase'

const AppTabs = createBottomTabNavigator();
const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const ProductInfoStack = createStackNavigator();

//Tab Navigator

const AppTabsScreen = () => (

  <AppTabs.Navigator>

    <AppTabs.Screen
      name="home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Início',
        tabBarIcon: props => (
          <Ionicons name="ios-home" size={props.size} color={props.color} />
        )
      }}
    />

    <AppTabs.Screen
      name="wallet"
      component={WalletScreen}
      options={{
        tabBarLabel: 'Carteira',
        tabBarIcon: props => (
          <Ionicons name="ios-wallet" size={props.size} color={props.color} />
        )
      }}
    />

    <AppTabs.Screen
      name="profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Perfil',
        tabBarIcon: props => (
          
          <Ionicons
            name="md-person"
            size={props.size}
            color={props.color}
          />
        )
      }}
    />

  </AppTabs.Navigator>
);

//Telas de autenticação e login

const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

const ProductInfoStackScreen  = () => (
  <ProductInfoStack.Navigator>
    <ProductInfoStack.Screen name="productInfo" component={ProductScreen} />
  </ProductInfoStack.Navigator>
);



const RootStackScreen = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setUser(user)
    } else {
      setUser(null)
    }
  });

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(!isLoading);
    }, 500);
  }, []);

  return (
    <RootStack.Navigator
      headerMode="none"
      screenOptions={{ animationEnabled: false }}

    >
      {isLoading ? (
        <RootStack.Screen name="Loading" component={Loading} />
      ) : user ? (
        <RootStack.Screen name="AppTabsScreen" component={AppTabsScreen} />
      ) : (
        <RootStack.Screen name="AuthStackScreen" component={AuthStackScreen} />
      )}

    </RootStack.Navigator>
  );
};

export default () => {
  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>
  );
};

