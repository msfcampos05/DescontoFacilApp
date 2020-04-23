import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import Login from "../screens/Login";
import Loading from "../screens/Loading";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Modal from "../screens/Modal";

const HomeStack = createStackNavigator();
const HomeStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Home"
      component={Home}
      options={{
        headerTitle: "Home"
      }}
    />
    
  </HomeStack.Navigator>
);

const ProfileStack = createStackNavigator();
const ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={Profile} />
  </ProfileStack.Navigator>
);

const CreateNewPlaceholder = () => (
  <View style={{ flex: 1, backgroundColor: "blue" }} />
);
const AppTabs = createBottomTabNavigator();
const AppTabsScreen = () => (
  <AppTabs.Navigator>
    <AppTabs.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarIcon: props => (
          <Ionicons name="ios-home" size={props.size} color={props.color} />
        )
      }}
    />
    <AppTabs.Screen
      name="Create"
      component={CreateNewPlaceholder}
      options={{
        tabBarIcon: props => (
          <Ionicons name="ios-add" size={props.size} color={props.color} />
        )
      }}
      listeners={({ navigation }) => ({
        tabPress: event => {
          event.preventDefault();
          navigation.navigate("CreateNew");
        }
      })}
    />
    <AppTabs.Screen
      name="Profile"
      component={ProfileStackScreen}
      options={{
        tabBarIcon: props => (
          <Ionicons
            name="ios-checkmark-circle-outline"
            size={props.size}
            color={props.color}
          />
        )
      }}
    />
  </AppTabs.Navigator>
);


const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={Login} />
  </AuthStack.Navigator>
);

const CreateNew = () => <View style={{ flex: 1, backgroundColor: "red" }} />;
const RootStack = createStackNavigator();
const RootStackScreen = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(!isLoading);
      //setUser({});
    }, 500);
  }, []);

  return (
    <RootStack.Navigator
      headerMode="none"
      screenOptions={{ animationEnabled: false }}
      mode="modal"
    >
      {isLoading ? (
        <RootStack.Screen name="Loading" component={Loading} />
      ) : user ? (
        <RootStack.Screen name="AppTabsScreen" component={AppTabsScreen} />
      ) : (
        <RootStack.Screen name="AuthStackScreen" component={AuthStackScreen} />
      )}
      <RootStack.Screen
        name="CreateNew"
        component={CreateNew}
        options={{ animationEnabled: true }}
      />
      <RootStack.Screen
        name="Modal"
        component={Modal}
        options={{ animationEnabled: true }}
      />
      <RootStack.Screen
        name="Alert"
        component={Modal}
        options={{
          animationEnabled: true,
          cardStyle: { backgroundColor: "rgba(0, 0, 0, 0.15)" },
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 0.5, 0.9, 1],
                  outputRange: [0, 0.25, 0.7, 1]
                })
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                  extrapolate: "clamp"
                })
              }
            };
          }
        }}
      />
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

