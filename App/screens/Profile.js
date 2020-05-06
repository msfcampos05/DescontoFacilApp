import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    SafeAreaView,
    Alert,
    StatusBar,
    Modal,
    TextInput,
    ActivityIndicator

} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
//Firebase imports
import * as firebase from 'firebase';
import FireFunctions from "../config/FireFunctions";
//Lottie imports using on loading elements
import Lottie from 'lottie-react-native';
import photoself from '../Components/loaders/selfie.json';
import dataloading from '../Components/loaders/mario.json';

import { Icon } from 'react-native-elements';

export default function Profile({ navigation }) {

    const [user, setUser] = useState([]);
    const [upName, setupName] = useState('');
    const [upCargo, setupCargo] = useState('');
    const [upTel, setupTel] = useState('');
    const [users, setUsers] = useState([]); // Initial empty array of users
    const [loading, setLoading] = useState(false); // Set loading to true on component mount
    const [avatarSource, setavatarSource] = useState("https://i.dlpng.com/static/png/1647142-profilepng-512512-profile-png-512_512_preview.png");
    const [modalVisible, setmodalVisible] = useState(false);
    const [whatoading, setwhatoading] = useState();
    const [secondTextInput, setsecondTextInput] = useState();
    const [thirtyTextInput, setthirtyTextInput] = useState();
    console.disableYellowBox = true;



    async function getUserInfo() {

        try {
            firebase.firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .collection("profile")
                .doc("personal")
                .get()
                .then(doc => {
                    setUsers(doc.data())
                });

        } catch (error) {
            console.log('erro no profile.js', error);
        }
 
    }

    async function getPhotoPermission() {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            if (status != "granted") {
                alert("We need permission to use your camera roll if you'd like to incude a photo.");
            }
        }
    };

    useEffect(() => {
        setUser(firebase.auth().currentUser);
        if (firebase.auth().currentUser.photoURL == null || user.photoURL == '') {
            setavatarSource("https://i.dlpng.com/static/png/1647142-profilepng-512512-profile-png-512_512_preview.png");
        } else {
            setavatarSource(firebase.auth().currentUser.photoURL);
        }
        getPhotoPermission();
        const userInfo = getUserInfo();

        return () => userInfo; // Stop listening for updates whenever the component unmounts

    }, [])


    async function changePhto() {

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!result.cancelled) {
            setwhatoading(1);
            setLoading(true);
            setavatarSource(result.uri);
            await FireFunctions.shared
                .uploadUserPhotoAsync(result.uri).then(ref => {

                    firebase.auth().currentUser.updateProfile({
                        photoURL: ref
                    }).then(function () {
                        setTimeout(() => {
                            setavatarSource(firebase.auth().currentUser.photoURL);
                            setLoading(false);
                            Alert.alert('Tudo OK!', 'Sua foto foi atualizada!', [
                                {
                                    text: 'Fechar',
                                    style: 'cancel',
                                }
                            ]);
                        },
                            1000);
                        
                    })

                })
        }

    }

    function setModalVisible(visible) {
        setmodalVisible(visible);
    }

    function logOut() {
        try {
            firebase.auth().signOut().then()
                .catch(function (error) {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    async function updateUserInfo(n, c, t) {
        const nam = n;
        const carg = c;
        const tell = t;

        try {
            if (n == null || n === '' && c == null || c === '' && t == null || t === '') {

                Alert.alert('Houve um Erro!', 'Os campos não podem estar em branco', [
                    {
                        text: 'Fechar',
                        style: 'cancel',
                    }
                ]);
            } else {
                setwhatoading(2);
                setLoading(true);
                await firebase.firestore()
                    .collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .collection("profile")
                    .doc("personal")
                    .update({
                        name: nam,
                        phone: tell,
                        adress: carg,
                    })
                    .then(function () {

                        setTimeout(() => {
                            setLoading(false);
                            setModalVisible(!modalVisible);
                            Alert.alert('Tudo certo!', 'Seus dados foram atualizados', [
                                {
                                    text: 'Fechar',
                                    style: 'cancel',
                                }
                            ]);
                        },
                            2000);


                    });

            }
        } catch (error) {
            console.log(error);


        }
    }

    if (loading == true && whatoading == 1) {
        return (
            <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#ffff' }}>
                <Lottie source={photoself} style={{ width: 350, height: 350 }} autoPlay loop />
                <Text style={{ textAlign: 'center', color: '#e3345f', fontSize: 12 }}>Hum, acho que vi um gatinho(a)...Alterando Foto</Text>
            </View>
        )
    } else if (loading == true && whatoading == 2) {
        return (
            <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#ffff' }}>
                <Lottie source={dataloading} style={{ width: 350, height: 350 }} autoPlay loop />
                <Text style={{ textAlign: 'center', color: '#e3345f', fontSize: 12 }}>Aguarde... Estamos Salvando as Alterações</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={changePhto}>
                <Image style={styles.Image} source={{ uri: avatarSource }} />
            </TouchableOpacity>
            <View style={styles.profileName}>

                <Text style={styles.TextName}>
                    {users.name}

                </Text>

                <TouchableOpacity onPress={() => {
                    setModalVisible(true);
                }}>
                    <Icon name='ios-create' type='ionicon' color='#ffff' />
                </TouchableOpacity>

                <Text style={styles.Text}>
                    Endereço: {users.adress}
                </Text>
                <Text style={styles.Text}>
                    Telefone: {users.phone}
                </Text>
                <Text style={styles.Text}>
                    Email: {user.email}
                </Text>
                <View style={{ alignContent: 'stretch', alignItems: 'center', marginTop: 150 }}>
                    <TouchableOpacity
                        onPress={logOut}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={{ marginTop: 22 }} style={styles.container}>

                    <View style={{ flexDirection: 'row' }}>
                        <Icon name='ios-person' type='ionicon' color='#ffff' size={30} marginTop={20} marginRight={8} />
                        <Text style={styles.modalTitle}>Atualize seu Perfil</Text>

                    </View>


                    <View style={styles.form}>
                        <Text style={styles.label}> Nome: </Text>
                        <TextInput
                            style={styles.input}
                            maxLength={15}
                            placeholder="Alterar seu nome"
                            placeholderTextColor="#fff"
                            returnKeyType={"next"}
                            onSubmitEditing={() => { secondTextInput.focus(); }}
                            blurOnSubmit={false}
                            onChangeText={setupName}
                            autoCompleteType='name'
                            autoCorrect={false}
                        />

                        <Text style={styles.label}> Endereço: </Text>
                        <TextInput
                            style={styles.input}
                            maxLength={15}
                            placeholder="Alterar Endereço"
                            placeholderTextColor="#fff"
                            returnKeyType={"next"}
                            onSubmitEditing={() => { thirtyTextInput.focus(); }}
                            blurOnSubmit={false}
                            ref={(input) => { setsecondTextInput(input); }}
                            onChangeText={setupCargo}
                            autoCompleteType='name'
                            autoCorrect={false}
                        />

                        <Text style={styles.label}> Telefone: </Text>
                        <TextInput
                            style={styles.input}
                            maxLength={11}
                            placeholder="Alterar Telefone"
                            placeholderTextColor="#fff"
                            keyboardType='phone-pad'
                            ref={(input) => { setthirtyTextInput(input); }}
                            onChangeText={setupTel}
                            autoCompleteType='cc-number'
                            autoCorrect={false}
                        />

                        <Text style={styles.separator}>____________________________________________</Text>

                        <TouchableOpacity style={styles.modalbutton}
                            onPress={() => {
                                updateUserInfo(upName, upCargo, upTel);
                            }}>
                            <Text style={styles.modalbuttonText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalbutton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}>
                            <Text style={styles.modalbuttonText}>Sair</Text>
                        </TouchableOpacity>



                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff5b77',
        alignItems: 'center',
    },
    lottie: {
        width: 400,
        height: 400
    },
    Image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderColor: '#ffff',
        borderWidth: 8,
        alignSelf: 'center',
        marginTop: 40
    },
    modalTitle: {
        alignSelf: 'center',
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 24,
        marginTop: 20,
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#f05a5b',
        height: 44,
        marginBottom: 20,
        borderRadius: 12
    },
    form: {
        alignSelf: 'stretch',
        paddingHorizontal: 30,
        marginTop: 0
    },
    label: {
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8
    },
    profileName: {

    },
    separator: {
        alignSelf: 'center',
        color: '#f55'
    },
    TextName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffff',
        alignSelf: 'center',
        marginTop: 20
    },
    Text: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ffff',
        alignSelf: 'center',
        marginTop: 10
    },
    button: {
        height: 42,
        backgroundColor: '#f09a5b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        bottom: 90,
        borderRadius: 100

    },

    buttonText: {
        color: '#FFFF',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 80,
        marginRight: 80,

    },

    modalbutton: {
        height: 42,
        backgroundColor: '#f95b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        top: 10,
        marginTop: 20

    },

    modalbuttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16
    },

})