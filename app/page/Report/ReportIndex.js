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
import Income from './Income';
import StockCapital from './StockCapital';
import GoodSales from './GoodSales';
import Icon from 'react-native-vector-icons/FontAwesome';

class ReportIndex extends React.Component {
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

    _onPress(com, name, title) {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.push({
                name: name,
                component: com,
                params: {
                    headTitle: title
                }
            });
        }
    }

    //shouldComponentUpdate(nextProps, nextState){
    //    return nextProps.value !== this.props.value;
    //}
    render() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>

                <View style={{flexDirection:'column'}}>
                    <TouchableHighlight style={styles.touch}
                                        onPress={this._onPress.bind(this, Income, 'Income', '营业收入统计')}
                                        underlayColor={'#CCCC99'}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name={'money'} size={30} color={'#0099CC'}/>
                            <Text style={styles.touchText}>营业收入统计</Text>
                            <Icon name={'angle-right'} size={20} color={'#ccc'}/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touch}
                                        onPress={this._onPress.bind(this, StockCapital, 'StockCapital', '库存资产统计')}
                                        underlayColor={'#CCCC99'}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name={'database'} size={30} color={'#0099CC'}/>
                            <Text style={styles.touchText}>库存资产统计</Text>
                            <Icon name={'angle-right'} size={20} color={'#ccc'}/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.touch}
                                        onPress={this._onPress.bind(this, GoodSales, 'GoodSales', '商品销售统计')}
                                        underlayColor={'#CCCC99'}>

                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Icon name={'cart-plus'} size={30} color={'#0099CC'}/>
                            <Text style={styles.touchText}>商品销售统计</Text>
                            <Icon name={'angle-right'} size={20} color={'#ccc'}/>
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
        backgroundColor: '#e7e7e7',
    },
    touch: {
        flex: 1,
        height: 50,
        justifyContent:'center',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#ccc',
    },
    touchText: {
        flex:1,
        color: '#0099CC',
        fontSize: 18,
        marginLeft:20,
    }
});

module.exports = ReportIndex;