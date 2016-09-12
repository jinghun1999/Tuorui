/**
 * Created by User on 2016-07-20.
 */
'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Platform
    } from 'react-native';
import Camera from 'react-native-camera';
import BarcodeScanner from 'react-native-barcodescanner';

var ScanQr = React.createClass({
    propTypes: {
        cancelButtonVisible: React.PropTypes.bool,
        cancelButtonTitle: React.PropTypes.string,
        onSucess: React.PropTypes.func,
    },

    getDefaultProps: function () {
        return {
            cancelButtonVisible: true,
            cancelButtonTitle: 'Cancel',
        };
    },

    _onPressCancel: function () {
        var _this = this;
        requestAnimationFrame(function () {
            _this.props.navigator.pop();
        });
    },

    _onBarCodeRead: function (result) {
        var _this = this;
        if (this.barCodeFlag) {
            this.barCodeFlag = false;
            setTimeout(function () {
                Vibration.vibrate();
                _this.props.navigator.pop();
                _this.props.onSucess(result.data);
            }, 1000);
        }
    },

    render: function () {
        var cancelButton = null;
        this.barCodeFlag = true;

        if (this.props.cancelButtonVisible) {
            cancelButton = <CancelButton onPress={this._onPressCancel} title={this.props.cancelButtonTitle}/>;
        }
        let scanArea = null
        if (Platform.OS === 'ios') {
            scanArea = (
                <View style={styles.rectangleContainer}>
                    <View style={styles.rectangle}/>
                </View>
            )
        }
        return (
            <View style={{marginBottom:100, justifyContent:'center'}}>
                <View>
                    <BarcodeScanner onBarCodeRead={this._onBarCodeRead} style={styles.camera}>
                        {scanArea}
                    </BarcodeScanner>
                </View>
                <View style={{alignItems:'center', height:130}}>
                    {cancelButton}
                </View>
            </View>
        );
    },
});

var CancelButton = React.createClass({
    render: function () {
        return (
            <View style={styles.cancelButton}>
                <TouchableOpacity onPress={this.props.onPress}>
                    <Text style={styles.cancelButtonText}>{this.props.title}</Text>
                </TouchableOpacity>
            </View>
        );
    },
});

const styles = StyleSheet.create({
    camera: {
        flex: 1,
        height: 568,
        alignItems: 'center',
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 250,
        width: 250,
        borderWidth: 2,
        borderColor: '#00FF00',
        backgroundColor: 'transparent'
    },

    cancelButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'blue',
        borderRadius: 3,
        padding: 15,
        width: 100,
        bottom: 10,
    },
    cancelButtonText: {
        fontSize: 17,
        fontWeight: '500',
        color: '#0097CE',
    },
})

module.exports = ScanQr;