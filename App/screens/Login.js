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

import logo from '../../assets/Logo-1.png';

//Lottie depence 
import Lottie from 'lottie-react-native';
//Lottie File 
import dataloading from '../Components/loaders/mario.json';


import * as firebase from 'firebase'
import Firebase from '../config/firebase'
import "firebase/auth";

export default ({ navigation }) => {


  if (!firebase.apps.length) {
    firebase.initializeApp(Firebase);
  }

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



    if (email == null || email === '' || password == null || password === '') {

      alertDefault('O campo de e-mail ou senha não podem estar em branco');

    } else {

      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {

          //chek is is new user to redirect to welcome screen

          setLoading(true);
          //Loading awai 1000ms to close
          setTimeout(() => {
            setLoading(false);
            // if isNewUser is true direct to welcome screen else to home called tab1 (condição ternária javascript)
          },
            3500);

        })
        .catch(function (error) {

          var errorCode = error.code;

          setLoading(false);

          if (errorCode === 'auth/wrong-password') {

            alertDefault('Sua senha não corresponde a senha cadastrada!');

          } else if (errorCode === 'auth/invalid-email') {

            alertDefault('Verifique se o email foi digitado corretamente!');

          } else if (errorCode === 'auth/user-disabled') {

            alertDefault('Seu usuário foi desabilitado!');


          } else if (errorCode === 'auth/user-not-found') {

            alertDefault('Seu usuário não foi encontrato no sistema!');

          } else {
            alertDefault('Verifique a conexão com a internet ou contate o administrador do sistema!');
          }
          console.log(error);

        });

    };


  };

  const forgotPassword = async () =>  {

    if (email == null || email === '') {

      alertDefault('Digite um email para redefinir sua senha!');

    } else {

      setLoading(true);
      await firebase.auth().sendPasswordResetEmail(email)
        .then(function (user) {

          //Loading awai 1000ms to close
          setTimeout(() => {
            setLoading(false);
            Alert.alert('E-mail Enviado!', 'Verifique sua caixa de entrada no email digitado!', [
              {
                text: 'Fechar',
                style: 'cancel',
              }
            ]);
          },
            1500);

        })
    }
  }

  //loading
  if (loading == true) {
    return (
      <View
        style={{

          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#694fad'
        }}>

        <Lottie source={dataloading} style={{ width: 300, height: 300 }} autoPlay loop />
        <Text style={{ color: '#ffff', fontWeight: 'bold', marginTop: 8 }}>
          Aguarde...Estamos carregando tudo para você!
          </Text>
      </View>
    )
  }

  return (

    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
    >
      <StatusBar
        hidden={false}
        backgroundColor='#f05a5b'
      />

      <Image style={styles.Image} source={logo} />

      <Text style={styles.tittle}>DescontoFacilApp</Text>

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
          style={styles.buttonf2}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonTextf}>Não tem conta?  Inscreva-se...</Text>
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
    borderRadius: 40,
  },
  buttonf2: {
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    borderWidth: 0.5,
    marginBottom: 10
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
    height: 200
  },

})
