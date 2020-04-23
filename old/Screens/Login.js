import React, { useState, useEffect, Component } from 'react';

import {
    Alert,
    View,
    Text,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Image,
    TouchableOpacity,
    StatusBar
} from 'react-native';

//import { firebase } from '@react-native-firebase/auth';

import logo from '../assets/logo-home.png'

//Função para pegar o objeto com dados do usuário do firestorage 


const Login = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [secondTextInput, setsecondTextInput] = useState();

    //Alerta padrao recebe mensagem e mostra alerta (evita várias chamadas desnecessárias do mesmo alerta)
    const alertDefault = (type) => {

        const message = type;

        Alert.alert('Houve um Erro!', message, [
            {
                text: 'Fechar',
                style: 'cancel',
            }
        ]);

    }

    async function handleSubmit() {
    }

    return (

        <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}
        >
            <StatusBar
                hidden={true}
                backgroundColor = '#694fad'
            />
            
            <Image style={styles.Image} source={logo} />

            <Text style={styles.tittle}>EnferApp Agenda</Text>

            <View style={styles.form}>
                <Text style={styles.label}>SEU EMAIL *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="email@exemple.com"
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    returnKeyType={"next"}
                    onSubmitEditing={() => { secondTextInput.focus(); }}
                    blurOnSubmit={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>SENHA *</Text>

                <TextInput style={styles.input}
                    autoCapitalize="none"
                    ref={(input) => { setsecondTextInput(input); }}
                    secureTextEntry
                    autoCorrrect={false}
                    placeholder="******"
                    value={password}
                    onChangeText={setPassword}

                />
                <TouchableOpacity
                    onPress={forgotPassword}
                    style={styles.buttonf}
                >
                    <Text style={styles.buttonTextf}>Esqueçeu sua senha? Clique Aqui!</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Fazer Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 300,
        height: 300
    },
    form: {
        alignSelf: 'stretch',
        paddingHorizontal: 30,
        marginTop: 0
    },

    tittle: {
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 10,
        fontSize: 18
    },

    label: {
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 4
    },

    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#444',
        height: 44,
        marginBottom: 10,
        borderRadius: 20
    },

    button: {
        height: 42,
        backgroundColor: '#f05a5b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40
    },

    buttonf: {
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    },
    buttonTextf: {
        color: '#f44',
        fontWeight: 'bold',
        fontSize: 12
    },

    Image: {
        width: 200,
        height: 220
    },

})

export default Login;