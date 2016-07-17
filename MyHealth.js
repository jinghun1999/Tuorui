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
    Image,
    ScrollView,
    View
} from 'react-native';
import Head from './Head';
import TopScreen from './TopScreen';
class MyHealth extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Head/>
                    <View style={styles.line}/>
                    <View style={styles.view}>
                        <Image source={require('./image/health_test.png')}
                               style={styles.imageIcon}/>
                        <Text style={styles.t0}>健康监测</Text>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.view}>
                        <Image source={require('./image/health_report.png')}
                               style={styles.imageIcon}/>
                        <Text style={styles.t0}>健康报告</Text>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.view}>
                        <Image source={require('./image/base_log.png')}
                               style={styles.imageIcon}/>
                        <Text style={styles.t0}>健康日志</Text>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.view}>
                        <Image source={require('./image/health_manage_task.png')}
                               style={styles.imageIcon}/>
                        <Text style={styles.t0}>健康任务</Text>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.line}/>
                    <View style={styles.view}>
                        <Image source={require('./image/health_manage.png')}
                               style={styles.imageIcon}/>
                        <Text style={styles.t0}>健康目标</Text>
                            <Image source={require('./image/arrows_right.png')}
                                   style={styles.imageArr}/>
                    </View>
                    <View style={styles.line}/>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
    view: {
        flexDirection: 'row',
        height: 50,
        backgroundColor: '#F8F8FF',
    },

    line: {
        height: 1,
        alignSelf: 'stretch',
        backgroundColor: '#708090',
    },
    imageIcon: {
        height: 30,
        width: 30,
        alignSelf: 'center',
        marginLeft: 20,
        marginRight: 20,
    },
    t0: {
        flex:1,
        alignSelf: 'center',
        fontSize: 20,
    },

    imageArr: {
        height: 20,
        width: 20,
        alignSelf:'center',
        //marginLeft:0,
    },

});

module.exports = MyHealth;
