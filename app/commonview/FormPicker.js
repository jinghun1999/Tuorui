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
    } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
class FormPicker extends React.Component {
    render() {
        var _nob = this.props.showbottom == false;
        return (
            <View style={[{flexDirection: 'row', flex: 1,}, _nob?styles.nobottom:styles.selectCom]}>
                <View style={{width:100, height:50, justifyContent:'center', marginLeft:10}}>
                    <Text style={{color:'#888'}}>{this.props.title}</Text>
                </View>
                <TouchableOpacity
                    style={styles.touchBox}
                    onPress={this.props.onPress}>
                    <View style={{flex:1, height:50, justifyContent:'center'}}>
                        <Text style={styles.SelectText}>{this.props.tips}</Text>
                    </View>
                    <View style={{height:50, width:20, alignItems:'center', justifyContent:'center'}}>
                        <Icon name={'angle-right'} size={20} color={'#ccc'}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    selectCom: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
    },
    touchBox: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    SelectText: {
        color: '#000',
        fontSize: 16,
        marginLeft: 10,
    },
});
module.exports = FormPicker;