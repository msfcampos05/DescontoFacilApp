import React from "react";
import { View, Alert, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, TextInput, Image, Button,StatusBar } from "react-native";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import FireFunctions from "../config/FireFunctions";
import * as firebase from 'firebase'
import * as ImagePicker from "expo-image-picker";
import Lottie from 'lottie-react-native';
import dataloading from '../Components/loaders/selfie.json';

export default class addProductScreen extends React.Component {
    state = {
        text: "",
        description: "",
        price: "",
        image: null,
        loading: false
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

     handlePost = async () => {
        this.setState({loading:true });
        FireFunctions.shared
            .addPost({ text: this.state.text.trim(), price: this.state.price.trim(), description: this.state.description.trim(), localUri: this.state.image })
            .then(ref => {

                setTimeout(() => {
                     Alert.alert('Tudo certo!', 'Cupon de desconto disponível.', [
                        {
                            text: 'Fechar',
                            style: 'cancel',
                        }
                    ]);
                    
                    this.setState({ text: "", image: null, loading:false });
                    this.props.navigation.push('Home');
                },
                    1000);
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

        if (this.state.loading == true) {
            return (
                <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#ff5b77' }}>
                    <Lottie source={dataloading} style={{ width: 350, height: 350 }} autoPlay loop />
                    <Text style={{ textAlign: 'center', color: '#ffff', fontSize: 12 }}>Aguarde... Estamos Salvando as Alterações</Text>
                </View>
            )
        }

        return (
          <>  
            <StatusBar barStyle="light-content" backgroundColor="#ff5b77" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Desconto Fácil App</Text>
                
            </View>
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View>
                {this.state.image ? (
                        <Image
                            source={{ uri: this.state.image }}
                            style={{ width: '100%', height: 300 }}
                        />
                    ) : (
                        <TouchableOpacity onPress={this.pickImage}>
                            <Image style={styles.ButtonImg} source={require('../../assets/add_p.png')}/>
                        </TouchableOpacity>
                        )}
                
                
                <View style={styles.filds}>
                    
                       
                    <Text style={styles.Tittle} >Adicionar um cupom de desconto</Text>
                    
                    <TextInput 
                    style={styles.inputTittle} 
                    placeholder="Titulo"
                    value={this.state.text}
                    onChangeText={text => this.setState({ text })} 
                    />
                    
                    <TextInput 
                    style={styles.inputDescription} 
                    value={this.state.description}
                    placeholder="Descrição" 
                    onChangeText={description => this.setState({ description })}
                    />
                    
                    <TextInput 
                    style={styles.inputPrice} 
                    placeholder="Valor"
                    keyboardType='phone-pad'
                    autoCompleteType='cc-number'
                    value={this.state.price}
                    onChangeText={price => this.setState({ price })}
                    />     
                    
                    <View style={styles.ButtonSend}>
                        <Button
                            status='success'
                            title='Cadastrar'
                            onPress={this.handlePost}
                            disabled={
                                this.state.image && this.state.text && this.state.description && this.state.price
                                    ? false
                                    : true
                        }>    
                        </Button>
                        
                    </View>
                </View>
                </View>
            </KeyboardAvoidingView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent:'center',
        alignContent:'center' 
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
    filds:{
        alignSelf: 'stretch',
        paddingHorizontal: 30,
        marginBottom:40
    },
    Tittle:{
        fontSize:20,
        fontWeight:'bold',
        alignSelf:'center',
        marginBottom: 20
    },
    ButtonImg:{
        marginBottom:100,
        alignSelf:'center',
        width: 100,
        height:100
    },
    ButtonSend:{
        marginTop:20
    },
    inputTittle:{
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#444',
        height: 44,
        marginBottom: 10,
    },
    inputDescription:{
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#444',
        height: 44,
        marginBottom: 10,
    },
    inputPrice:{
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#444',
        height: 44,
        marginBottom: 10,
    }
    
});