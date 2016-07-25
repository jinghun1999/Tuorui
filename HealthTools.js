/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View
    } from 'react-native';
import Head from './app/commonview/Head';
class HealthTools extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Head title="健康工具"/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}
                            style={styles.contentContainer}>
                    <View style={styles.view}>
                        <Image source={require('./image/tool_lxtz.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>理想体重计算器</Text>
                            <Text style={styles.t1}>理想体重指的是体重数值在正常范围内，构成比例...</Text>
                        </View>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.view}>
                        <Image source={require('./image/tool_bmi.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>体重指数BMI</Text>
                            <Text style={styles.t1}>想知道您的体重是否超标吗？体重指数(BMI)能反应...</Text>
                        </View>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.view}>
                        <Image source={require('./image/tool_ytb.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>腰臀比计算</Text>
                            <Text style={styles.t1}>想知道您的体重是否超标吗？体重指数(BMI)能反应...</Text>
                        </View>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.view}>
                        <Image source={require('./image/tool_nlxq.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>每日能量需求</Text>
                            <Text style={styles.t1}>想知道您一天究竟该摄入多少能量吗？根据您提供...</Text>
                        </View>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.view}>
                        <Image source={require('./image/tool_yys.png')}
                               style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>营养素计算器</Text>
                            <Text style={styles.t1}>每种食物均含有不同的营养素，想了解您摄入食物中...</Text>
                        </View>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>

                    <View style={styles.view}>
                        <Image source={require('./image/tool_j.png')} style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>减掉一公斤</Text>
                            <Text style={styles.t1}>不同的运动锻炼方法，能量消耗的数量和方式也不相... </Text>
                        </View>
                        <Image source={require('./image/arrows_right.png')} style={styles.imageArr}/>
                    </View>
                    <View style={styles.view}>
                        <Image source={require('./image/tool_ydnh.png')} style={styles.imageIcon}/>
                        <View style={styles.view2}>
                            <Text style={styles.t0}>运动能耗计算</Text>
                            <Text style={styles.t1}>用食物重量图谱可以帮助你... </Text>
                        </View>
                        <Image source={require('./image/arrows_right.png')} style={styles.imageArr}/>
                    </View>
                </ScrollView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 20,
    },
    view: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 60,
        alignSelf: 'stretch',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#ccc',
    },
    view2: {
        flex: 1,
        height: 50,
        padding:5,
        justifyContent:'center',
        alignSelf: 'center',
    },
    imageIcon: {
        height: 50,
        width: 50,
        alignSelf: 'center',
        marginLeft: 20,
        marginRight: 20,
    },
    imageArr: {
        height: 20,
        width: 50,
        alignSelf: 'center',
        marginLeft: 10,
    },
    t0: {
        fontSize: 20,
    },
    t1: {
        fontSize: 10,
    },
});

module.exports = HealthTools;
