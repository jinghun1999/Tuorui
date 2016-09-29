/**
 * Created by User on 2016-09-02.
 */

'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    ActivityIndicator,
    Animated
    } from 'react-native';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    /*ヽ(≧Д≦)ノ*/
    render() {
        let body = <Bars size={10} color="#1CAFF6"/>
        if (this.props.type == 'text') {
            body = <Text style={styles.txt}>数据加载中...</Text>
        }
        return (
            <View style={styles.container}>
                <View style={styles.inner}>
                    <ActivityIndicator size="large" />
                    {body}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1,
        marginTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inner:{
        marginBottom:50,
        padding:15,
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:5,
        backgroundColor:'#404040',
        opacity:8,
    },
    txt:{
        color:'#fff',
    }
});
module.exports = Loading;
