/**
 * Created by User on 2016-09-12.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Vibration,
    TouchableOpacity,
    View,
    InteractionManager
    } from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';
import Loading from '../../commonview/Loading';
var TimerMixin = require('react-timer-mixin');

class ScanBarcode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barcode: '',
            cameraType: 'back',
            text: '请扫描',
            torchMode: 'off',
            type: '',
            loaded: false,
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                loaded: true,
            });
        });
    }

    _onPressCancel() {
        var _this = this;
        requestAnimationFrame(function () {
            _this._onBack();
        });
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    barcodeReceived(e) {
        if (e.data !== this.state.barcode || e.type !== this.state.type) Vibration.vibrate();
        this.setState({
            barcode: e.data,
            text: e.data,
            type: e.type,
        });
        let _this = this;
        if (this.props.onSucess) {
            this.timer = setTimeout(() => {
                _this.props.onSucess(e.data);
                _this._onBack();
            }, 500);
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        let body = <View style={{flex:1, alignItems:'center'}}><Loading type={'text'}/></View>
        if (this.state.loaded) {
            body = <BarcodeScanner
                onBarCodeRead={this.barcodeReceived.bind(this)}
                style={{ flex: 1 }}
                torchMode={this.state.torchMode}
                cameraType={this.state.cameraType}/>
        }
        return (
            <View style={styles.container}>
                {body}
                <View style={styles.statusBar}>
                    <View style={{flex:1, alignItems: 'center', justifyContent: 'center',}}>
                        <Text style={styles.statusBarText}>{this.state.text}</Text>
                    </View>
                    <TouchableOpacity style={styles.cancelButton} onPress={this._onPressCancel.bind(this)}>
                        <Text style={styles.cancelButtonText}>取消</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statusBar: {
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
    },
    statusBarText: {
        fontSize: 20,
    },
    cancelButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#CCCCCC',
        borderRadius: 3,
        padding: 5,
        width: 100,
        height: 30,
        marginLeft: 20,
        marginRight: 20,
    },
    cancelButtonText: {
        fontSize: 17,
        fontWeight: '500',
        color: '#0097CE',
    },
});

module.exports = ScanBarcode;