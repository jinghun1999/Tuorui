/**
 * Created by User on 2016-09-12.
 */
'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    TextInput,
    } from 'react-native';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

import ModalPicker from 'react-native-modal-picker'
class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textInputValue: ''
        };
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _loadData() {

    }

    componentDidMount() {
        var _this = this;
        _this.timer = setTimeout(
            () => {
                _this._loadData();
            }, 100
        )
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }


    render() {
        let index = 0;
        const data = [
            { key: index++, section: true, label: 'Fruits' },
            { key: index++, label: 'Red Apples' },
            { key: index++, label: 'Cherries' },
            { key: index++, label: 'Cranberries' },
            { key: index++, label: 'Pink Grapefruit' },
            { key: index++, label: 'Raspberries' },
            { key: index++, section: true, label: 'Vegetables' },
            { key: index++, label: 'Beets' },
            { key: index++, label: 'Red Peppers' },
            { key: index++, label: 'Radishes' },
            { key: index++, label: 'Radicchio' },
            { key: index++, label: 'Red Onions' },
            { key: index++, label: 'Red Potatoes' },
            { key: index++, label: 'Rhubarb' },
            { key: index++, label: 'Tomatoes' }
        ];
        return (
            <View style={styles.container}>
                <Head title="设置" canBack={true} onPress={this._onBack.bind(this)}/>
                <ModalPicker
                    data={data}
                    initValue="Select something yummy!"
                    cancelText={'取消'}
                    onChange={(option)=>{ alert(`${option.label} (${option.key}) nom nom nom`) }} />
                <ModalPicker
                    data={data}
                    style={{backgroundColor:'#ccc'}}
                    initValue="Select something yummy!"
                    onChange={(option)=>{ this.setState({textInputValue:option.label})}}>

                    <TextInput
                        style={{borderWidth:1, borderColor:'#ccc', padding:10, height:50}}
                        editable={false}
                        placeholder="Select something yummy!"
                        value={this.state.textInputValue} />

                </ModalPicker>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
});

module.exports = MyAccount;