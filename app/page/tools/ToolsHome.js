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
                            <Text style={styles.t0}>理想体重计算器</Text>
                            <Text style={styles.t1}>理想体重指的是体重数值在正常范围内，构成比例...</Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>
                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_bmi.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>体重指数BMI</Text>
                            <Text style={styles.t1}>想知道您的体重是否超标吗？体重指数(BMI)能反应...</Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>
                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_ytb.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>腰臀比计算</Text>
                            <Text style={styles.t1}>想知道您的体重是否超标吗？体重指数(BMI)能反应...</Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>
                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_nlxq.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>每日能量需求</Text>
                            <Text style={styles.t1}>想知道您一天究竟该摄入多少能量吗？根据您提供...</Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>
                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_yys.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>营养素计算器</Text>
                            <Text style={styles.t1}>每种食物均含有不同的营养素，想了解您摄入食物中...</Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>

                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_j.png')} style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>减掉一公斤</Text>
                            <Text style={styles.t1}>不同的运动锻炼方法，能量消耗的数量和方式也不相... </Text>
                        </View>
                        <Icon name={'chevron-right'} size={20} color={'#888'} style={styles.icoRight}/>
                    </View>
                    <View style={styles.row}>
                        <Image source={require('../../../image/tool_ydnh.png')} style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>运动能耗计算</Text>
                            <Text style={styles.t1}>用食物重量图谱可以帮助你... </Text>
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