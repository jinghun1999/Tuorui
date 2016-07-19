/**
 * Created by tuorui on 2016/7/19.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,

    StyleSheet,
    Text,
    View
} from 'react-native';

class SaleHead extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>销售</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 50,
        alignSelf: 'stretch',
        backgroundColor: '#219772',
        justifyContent: 'center',
    },
    welcome: {
        fontSize: 20,
        alignSelf:'center',
    },
});

module.exports = SaleHead;
