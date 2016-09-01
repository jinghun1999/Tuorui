/**
 * Created by tuorui on 2016/7/27.
 */
'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OtherIcon from 'react-native-vector-icons/MaterialIcons';
class ComIconView extends React.Component {
    render() {
        return (
            <TouchableOpacity style={styles.ViewBorder} onPress={this.props.onPress}>
                <View style={[{backgroundColor:this.props.IconColor},styles.IconStyle]}>
                    <Icon name={this.props.icon} size={30} color={this.props.color}/>
                </View>
                <Text style={styles.TextStyle}>{this.props.text}</Text>
                <View style={styles.IconRightOuter}>
                    <Icon name={'ios-arrow-forward'} size={15} color={'#666'}/>
                </View>
            </TouchableOpacity>
        )
    }
}
const styles = StyleSheet.create({
    ViewBorder: {
        flex: 1,
        flexDirection: 'row',
        height: 45,
        alignItems:'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    IconStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    TextStyle: {
        flex: 1,
        alignSelf: 'center',
        marginLeft: 20,
        fontSize: 15,
        color: '#666',
    },
    IconRightOuter: {
        justifyContent: 'center',
        alignSelf: 'center',
        width: 25,
        height: 25,
        marginRight: 10,
    },
})
module.exports = ComIconView;