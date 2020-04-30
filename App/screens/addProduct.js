import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image, Button } from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import FireFunctions from "../config/FireFunctions";
import * as firebase from 'firebase'
import * as ImagePicker from "expo-image-picker";


export default class addProductScreen extends React.Component {
    state = {
        text: "",
        description: "",
        price: "",
        image: null
    };

    componentDidMount() {
        this.getPhotoPermission();
    }

    getPhotoPermission = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (status != "granted") {
                alert("We need permission to use your camera roll if you'd like to incude a photo.");
            }
        }
    };

    handlePost = () => {
        FireFunctions.shared
            .addPost({ text: this.state.text.trim(), price: this.state.price.trim(), description: this.state.description.trim(), localUri: this.state.image })
            .then(ref => {
                this.setState({ text: "", image: null });
                this.props.navigation.push('Home');
            })
            .catch(error => {
                alert(error);
            });
    };

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.imageContainer}>
                    <View>
                        {this.state.image ? (
                            <Image
                                source={{ uri: this.state.image }}
                                style={{ width: '100%', height: 300 }}
                            />
                        ) : (   <View style={styles.Button}>
                                <Button
                                    onPress={this.pickImage}
                                    title='Add an image'>
                                </Button>
                                </View>
                            )}
                    </View>
                    <View style={{ marginTop: 40, alignItems: 'center' }}>
                        <Text style={styles.H4}>Detalhes do Produto</Text>
                        <TextInput
                            placeholder='Nome do produto'
                            style={styles.textInput}
                            value={this.state.text}
                            onChangeText={text => this.setState({ text })}
                        />
                        <TextInput
                            placeholder='Descrição do produto'
                            style={styles.textInputDescription}
                            multiline={true}
                            numberOfLines={4}
                            value={this.state.description}
                            onChangeText={description => this.setState({ description })}
                        />
                        <TextInput
                            placeholder='Valor'
                            style={styles.textInput}
                            value={this.state.price}
                            onChangeText={price => this.setState({ price })}
                        />
                        <Button
                            style={styles.ButtonSend}
                            status='success'
                            onPress={this.handlePost}
                            disabled={
                                this.state.image && this.state.text && this.state.description && this.state.price
                                    ? false
                                    : true
                            }
                            title='Cadastrar'
                        >
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    textInput: {
        margin: 20,
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 40,
        fontSize: 16,
        color: '#444',
        height: 44,
        marginBottom: 10,
        borderRadius: 10
    },
    textInputDescription: {
        margin: 20,
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 40,
        fontSize: 16,
        color: '#444',
        height: 50,
        marginBottom: 10,
        borderRadius: 10
    },
    imageContainer:{
        marginTop: 40 
    },
    H4: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    Button: {
        alignItems: 'center',
        
    }
});