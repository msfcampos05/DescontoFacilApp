import React, { Component } from 'react'
import { Image, View } from 'react-native'
import { Text, Button, TextInput } from 'react-native-ui-kitten'
import ImagePicker from 'react-native-image-picker'
import { withFirebaseHOC } from '../utils'

class AddPost extends Component {
    state = { image: null, title: '', description: '' }

    onChangeTitle = title => {
        this.setState({ title })
    }
    onChangeDescription = description => {
        this.setState({ description })
    }
    onChangeDescription = description => {
        this.setState({ price })
    }

    onSubmit = async () => {
        try {
            const post = {
                photo: this.state.image,
                title: this.state.title,
                description: this.state.description
            }
            this.props.firebase.uploadPost(post)

            this.setState({
                image: null,
                title: '',
                description: '',
                price: ''
            })
        } catch (e) {
            console.error(e)
        }
    }

    selectImage = () => {
        const options = {
            noData: true
        }
        ImagePicker.launchImageLibrary(options, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker')
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton)
            } else {
                const source = { uri: response.uri }
                console.log(source)
                this.setState({
                    image: source
                })
            }
        })
    }

    render() {
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Ionicons name="md-arrow-back" size={24} color="#D8D9DB"></Ionicons>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginTop: 60 }}>
                <View>
                    {this.state.image ? (
                        <Image
                            source={this.state.image}
                            style={{ width: '100%', height: 300 }}
                        />
                    ) : (
                            <Button
                                onPress={this.pickImage}
                                style={{
                                    alignItems: 'center',
                                    padding: 10,
                                    margin: 30
                                }}>
                                Add an image
                            </Button>
                        )}
                </View>
                <View style={{ marginTop: 80, alignItems: 'center' }}>
                    <Text category='h4'>Post Details</Text>
                    <TextInput
                        placeholder='Nome do produto'
                        style={{ margin: 20 }}
                        value={this.state.text}
                        onChangeText={text => this.setState({ text })}
                    />
                    <TextInput
                        placeholder='Descrição do produto'
                        style={{ margin: 20 }}
                        value={this.state.description}
                        onChangeText={description => this.onChangeDescription(description)}
                    />
                    <TextInput
                        placeholder='Valor'
                        style={{ margin: 20 }}
                        value={this.state.price}
                        onChangeText={price => this.setState({ price })}
                    />
                    <Button
                        status='success'
                        onPress={this.handlePost}
                        disabled={
                            this.state.image && this.state.text && this.state.description && this.state.price
                                ? false
                                : true
                        }>
                        Add post
          </Button>
                </View>
            </View>
    )
    }
}

export default withFirebaseHOC(AddPost)