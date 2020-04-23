import * as React from 'react';
import { Text, View, StyleSheet, Button} from 'react-native';

const ScreenContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
  );
export const Home = ({ navigation }) => (
    <ScreenContainer>
      <Text>Master List Screen</Text>
      <Button
        title="React Native by Example"
        onPress={() =>
          navigation.push("Details", { name: "React Native by Example " })
        }
      />
      <Button
        title="React Native School"
        onPress={() =>
          navigation.push("Details", { name: "React Native School" })
        }
      />
      <Button title="Drawer" onPress={() => navigation.toggleDrawer()} />
    </ScreenContainer>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    button: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginVertical: 10,
      borderRadius: 5
    }
  });