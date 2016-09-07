/**
 * Created by User on 2016-09-05.
 */
/**
 * Created by User on 2016-09-06.
 */

'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    InteractionManager,
    } from 'react-native';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';

class Income extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        };
    }
    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    _onPress(){

    }
    //shouldComponentUpdate(nextProps, nextState){
    //    return nextProps.value !== this.props.value;
    //}
    render() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View style={{padding:5, marginTop:5, backgroundColor:'#CCCC99',}}>
                    <Text style={{color:'#CC3333'}}>宠物医院数据统计</Text>
                </View>
                <View style={{flexDirection:'column'}}>
                    <TouchableHighlight style={styles.touch} onPress={this._onPress.bind(this)} underlayColor={'#f1592a'}>
                        <View>
                            <Text style={styles.touchText}>营业收入统计</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touch} onPress={this._onPress.bind(this)} underlayColor={'#f1592a'}>
                        <View>
                            <Text style={styles.touchText}>库存资产统计</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touch} onPress={this._onPress.bind(this)} underlayColor={'#f1592a'}>
                        <View>
                            <Text style={styles.touchText}>商品销售统计</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    touch:{
        flex:1,
        height:50,
        justifyContent:'center',
        marginTop:5,
        padding:10,
        backgroundColor:'#333399'
    },
    touchText: {
        color: '#fff',
        fontSize:18,
    }
});

module.exports = Income;