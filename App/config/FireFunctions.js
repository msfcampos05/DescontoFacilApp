
import * as firebase from 'firebase'
var moment = require('moment');

class FireFunctions {

    updateProfile = async ({ username, email, phone, adress, password, localUri }) => {
        //enviar foto para firebase e retorna url para remoteUri
        const remoteUri = this.uploadUserPhotoAsync(localUri);
        //Cria um documento contendo os dados de perfil do usuário
        this.firestore
            .collection('users') //Coleção raiz
            .doc(this.uid) //Documento usuário único para cada usuário com seu uid
            .collection("profile")
            .doc("personal") // dentro do documento 'personal' adiciona os campos abaixo
            .add({
                name: username,
                phone: phone,
                adress: adress,
            })
            .then(ref => {
                res(ref);
            })
            .catch(error => {
                rej(error);
            });

        //Altera foto perfil usuário
        this.auth.currentUser.updateProfile({
            photoURL: remoteUri
        })

    }

    //Criar um novo usuário e atualizar os campos de profile
    addUser = async ({ username, email, phone, adress, password, localUri }) => {


        return new Promise((res, rej) => {

            this.auth
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    
                    this.updateProfile(username, email, phone, adress, password, localUri)
                    console.log('User account created & signed in!');

                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                    }

                    console.error(error);
                });

        });
    };

    uploadUserPhotoAsync = async uri => {
        const path = `users/${this.uid}/${this.uid}.jpg`;

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                .storage()
                .ref(path)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => { },
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };

    addPost = async ({ text, price, description, localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri);

        return new Promise((res, rej) => {
            this.firestore
                .collection("products")
                .add({
                    produto: text,
                    descricao: description,
                    valor: 'R$ ' + price,
                    img: remoteUri,
                })
                .then(ref => {
                    res(ref);
                })
                .catch(error => {
                    rej(error);
                });
        });
    };

    uploadPhotoAsync = async uri => {
        const path = `products/${this.uid}/${Date.now()}.jpg`;

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                .storage()
                .ref(path)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => { },
                err => {
                    rej(err);
                },
                async () => {
                    const url = await upload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            );
        });
    };

    get firestore() {
        return firebase.firestore();
    }
    get auth() {
        return firebase.auth();
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get timestamp() {

        return dataId;
    }
}

FireFunctions.shared = new FireFunctions();
export default FireFunctions;