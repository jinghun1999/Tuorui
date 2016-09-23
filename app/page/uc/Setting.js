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
    TouchableOpacity
    } from 'react-native';
import Head from '../../commonview/Head';
import Style from '../../theme/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalPicker from 'react-native-modal-picker';
class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    showInfo(o) {
        alert(o)
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }


    render() {
        return (
            <View style={Style.container}>
                <Head title="设置" canBack={true} onPress={this._onBack.bind(this)}/>
                <TouchableOpacity style={Style.rowBox} onPress={()=>this.showInfo('z')}>
                    <Text style={Style.titleText}>服务条款</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={Style.rowBox} onPress={()=>this.showInfo('z')}>
                    <Text style={Style.titleText}>服务条款</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={[Style.rowBox,{marginTop:10,}]} onPress={()=>this.showInfo('z')}>
                    <Text style={Style.titleText}>关于我们</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
                <TouchableOpacity style={Style.rowBox} onPress={()=>this.showInfo('z')}>
                    <Text style={Style.titleText}>联系我们</Text>
                    <Icon name={'chevron-right'} size={20} color={'#888'}/>
                </TouchableOpacity>
            </View>
        );
    }
}

module.exports = MyAccount;