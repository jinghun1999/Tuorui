/**
 * Created by User on 2016-07-22.
 */
'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    } from 'react-native';
class FormInput extends React.Component {
    render() {
        var _nob = this.props.showbottom == false;
        return (
            <View style={[{flexDirection: 'row', flex: 1,}, _nob? styles.nobottom: styles.inputWrap]}>
                <View style={styles.inputTitle}>
                    <Text style={{color:'#888',}}>{this.props.title}</Text>
                </View>
                <View style={styles.inputBox}>
                    <TextInput value={this.props.value}
                               onChangeText={this.props.onChangeText}
                               editable={this.props.enabled!=false}
                               underlineColorAndroid={'transparent'}
                               keyboardType={this.props.keyboardType}
                               placeholder={this.props.value}
                               style={{height: 30, borderWidth:0, flex:1}}/>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    inputWrap: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    inputTitle: {
        width: 80,
        height: 50,
        justifyContent: 'center',
        marginLeft: 10,
    },
    inputBox: {
        flex: 1,
        borderRadius: 5,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ccc',
        backgroundColor: '#FFFFFF',
        marginRight: 10,
        marginTop: 4,
        marginBottom: 4
    },
});
module.exports = FormInput;