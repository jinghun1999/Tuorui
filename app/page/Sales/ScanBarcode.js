/**
 * Created by User on 2016-09-12.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Vibration,
    TouchableOpacity,
    View,
    InteractionManager
} from 'react-native';
import BarcodeScanner from 'react-native-barcodescanner';
import Loading from '../../commonview/Loading';
import Head from '../../commonview/Head';

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
            scaned: false,
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
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    barcodeReceived(e) {
        let _this = this;
        if (e.data !== _this.state.barcode || e.type !== _this.state.type)
            Vibration.vibrate();
            _this.setState({
                barcode: e.data,
                text: `${e.data} (${e.type})`,
                type: e.type,
            });
            this.timer = setTimeout(() => {
                _this.props.onSucess(e.data);
                _this._onBack();
            }, 500);

    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        let body = <Loading type={'text'}/>
        if (this.state.loaded) {
            body = <BarcodeScanner
                onBarCodeRead={this.barcodeReceived.bind(this)}
                style={{ flex: 1 }}
                torchMode={this.state.torchMode}
                cameraType={this.state.cameraType}/>
        }
        return (
            <View style={styles.container}>
                <Head title='扫描二维码' canBack={true} onPress={this._onBack.bind(this)}/>
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