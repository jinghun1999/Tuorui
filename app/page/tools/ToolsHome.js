/**
 * Created by tuorui on 2016/7/15.
 */
'use strict';
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ListView,
    Image,
    Alert,
    } from 'react-native';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
export default class ToolsHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate() {
        return true;
    }

    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Head title='实用工具' canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}
                            style={styles.contentContainer}>
                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_lxtz.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>药物计算</Text>
                            <Text style={styles.t1}>病患宠物需要的药物剂量计算器...</Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>
                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_bmi.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>营养计算</Text>
                            <Text style={styles.t1}>计算动物体重是否超标，能量需求范围...</Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>
                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_ytb.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>单位换算</Text>
                            <Text style={styles.t1}>体重、长度、体积、温度等常用单位换算...</Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>
                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_nlxq.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>急救计算</Text>
                            <Text style={styles.t1}>紧急救助药物查询，误食食物如何用药...</Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>
                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_yys.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>心脏指数计算</Text>
                            <Text style={styles.t1}>心率及平均动脉压...</Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>

                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_j.png')} style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>输液计算</Text>
                            <Text style={styles.t1}>宠物就诊输液各指标值反馈... </Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>
                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_ydnh.png')} style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>血气计算</Text>
                            <Text style={styles.t1}>酸碱平衡和阴离子间隙计算... </Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
        container: {
            //justifyContent: 'flex-start',
            //alignItems: 'flex-start',
            backgroundColor: '#e7e7e7',
        },
        contentContainer: {
            flexDirection: 'column',
            paddingVertical: 20,
        },
        row: {
            flexDirection: 'row',
            //justifyContent: 'center',
            height: 60,
            alignSelf: 'stretch',
            backgroundColor: '#F8F8FF',
            borderBottomWidth:StyleSheet.hairlineWidth,
            borderBottomColor:'#ccc',
        },
        imageIcon: {
            height: 50,
            width: 50,
            alignSelf: 'center',
            marginLeft: 20,
            marginRight: 20,
        },
        view2: {
            flex: 1,
            height: 50,
            paddingTop:10,
            //alignSelf: 'center',
            //alignItems:'center',
            backgroundColor: '#F8F8FF',
        },
        icoRight: {
            width: 20,
            alignSelf: 'center',
            marginLeft: 10,
        },
        t0: {
            fontSize: 20,
        },
        t1: {
            fontSize: 10,
        },
    }
);
module.exports = ToolsHome;