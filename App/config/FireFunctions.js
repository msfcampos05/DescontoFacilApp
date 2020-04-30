
import * as firebase from 'firebase'
var moment = require('moment');

class FireFunctions {
    

    addPost = async ({ text, localUri }) => {
        const remoteUri = await this.uploadPhotoAsync(localUri);

        return new Promise((res, rej) => {
            this.firestore
                .collection("products")
                .doc(this.timestamp)
                .add({
                    produto: text,
                    descicao:'',
                    valor:Date.now(),
                    img: remoteUri,
                    validade:this.timestamp
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
        const path = `photos/${this.uid}/${Date.now()}.jpg`;

        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase
                .storage()
                .ref(path)
                .put(file);

            upload.on(
                "state_changed",
                snapshot => {},
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

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }

    get timestamp() {
        return moment().format();
    }
}

FireFunctions.shared = new FireFunctions();
export default FireFunctions;