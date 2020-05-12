/* Core */
import React, { Component } from 'react';

/* Presentational */
import { View, Text } from 'react-native';

import styles from './styles';

const SearchBar = () => (
    <View style={styles.container}>
        <View style={styles.SectionStyle}>
            <TouchableOpacity onPress={() => this.searchIconBack()}>
                <Image
                    //We are showing the Image from online
                    source={{ uri: this.state.barIcon }}
                    //Image Style
                    style={styles.ImageStyle}
                />
            </TouchableOpacity>
            <TextInput
                underlineColorAndroid="transparent"
                placeholder="O que procura..."
                placeholderTextColor="gray"
                value={this.state.query}
                onChange={this.filterItem.bind(this)}
                style={styles.input}
            />
        </View>
    </View>
);

export default SearchBar;