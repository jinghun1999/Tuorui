/**
 * Created by User on 2016-07-22.
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
import Icon from 'react-native-vector-icons/FontAwesome';
class FormPicker extends React.Component {
    render() {
        return (
            <View style={styles.selectCom}>
                <View style={{width:100, height:40, justifyContent:'center', marginLeft:20}}>
                    <Text style={{color:'#ccc'}}>{this.props.title}</Text>
                </View>
                <TouchableOpacity
                    style={styles.touchBox}
                    onPress={this.props.onPress}>
                    <View style={{flex:1, height:40, justifyContent:'center'}}>
                        <Text style={styles.SelectText}>{this.props.tips}</Text>
                    </View>
                    <View style={{height:40, width:20, alignItems:'center', justifyContent:'center'}}>
                        <Icon name={'angle-right'} size={20} color={'#ccc'} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    selectCom: {
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor:'#ccc',
    },
    touchBox: {
        flex: 1,
        flexDirection:'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginRight:10,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    SelectText: {
        color: '#888888',
        fontSize: 16,
        marginLeft:10,
    },
});
module.exports = FormPicker;