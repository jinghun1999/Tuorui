/**
 * Created by tuorui on 2016/9/5.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    ListView,
    TouchableOpacity,
}from 'react-native';
import Head from '../../commonview/Head';
class BeautyServices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    _onBack() {
        let _this = this;
        const {navigator}= _this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    render(){
        return(
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                
            </View>
        )
    }
}
const styles= StyleSheet.create({
    container:{},
})
module.exports=BeautyServices