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
import Head from './Head';
class HealthTools extends Component {
    render() {
        return (

            <View style={{flexDirection: 'row', height: 200, backgroundColor:"#fefefe", padding: 20}}>
                <View style={{flex: 1, flexDirection:'column', padding: 15, backgroundColor:"#eeeeee"}}>
                    <View style={{flex: 1, backgroundColor:"#bbaaaa"}}>
                    </View>
                    <View style={{flex: 1, backgroundColor:"#aabbaa"}}>
                    </View>
                </View>
                <View style={{flex: 1, padding: 15, flexDirection:'row', backgroundColor:"#eeeeee"}}>
                    <View style={{flex: 1, backgroundColor:"#aaaabb"}}>
                        <View style={{flex: 1, flexDirection:'row', backgroundColor:"#eeaaaa"}}>
                            <View style={{flex: 1, backgroundColor:"#eebbaa"}}>
                            </View>
                            <View style={{flex: 1, backgroundColor:"#bbccee"}}>
                            </View>
                        </View>
                        <View style={{flex: 1, backgroundColor:"#eebbdd"}}>
                        </View>
                    </View>
                    <View style={{flex: 1, backgroundColor:"#aaccaa"}}>
                        <ScrollView style={{flex: 1, backgroundColor:"#bbccdd", padding: 5}}>
                            <View style={{flexDirection: 'row', height: 50, backgroundColor:"#fefefe"}}>
                                <View style={{flex: 1, flexDirection:'column', backgroundColor:"#eeeeee"}}>
                                    <View style={{flex: 1, backgroundColor:"#bbaaaa"}}>
                                    </View>
                                    <View style={{flex: 1, backgroundColor:"#aabbaa"}}>
                                    </View>
                                </View>
                                <View style={{flex: 1, flexDirection:'row', backgroundColor:"#eeeeee"}}>
                                    <View style={{flex: 1, backgroundColor:"#aaaabb"}}>
                                        <View style={{flex: 1, flexDirection:'row', backgroundColor:"#eeaaaa"}}>
                                            <View style={{flex: 1, backgroundColor:"#eebbaa"}}>
                                            </View>
                                            <View style={{flex: 1, backgroundColor:"#bbccee"}}>
                                            </View>
                                        </View>
                                        <View style={{flex: 1, backgroundColor:"#eebbdd"}}>
                                        </View>
                                    </View>
                                    <View style={{flex: 1, backgroundColor:"#aaccaa"}}>
                                    </View>
                                </View>
                            </View>
                            <Text style={[styles.text, styles.header, {color: '#ffffff', fontSize: 12}]}>
                                {(function () {
                                    var str = '';
                                    var n = 100;
                                    while (n--) {
                                        str += '嵌套的网格' + '\n';
                                    }
                                    return str;
                                })()}
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
    contentContainer: {
        flexDirection: 'column',
        paddingVertical: 20,
        backgroundColor: "red",
    },
    view: {
        flexDirection: 'row',
        alignItems: 'stretch',
        height: 60,
        alignSelf: 'stretch',
        backgroundColor: '#F8F8FF',
    },
    view2: {
        flexDirection: 'column',
        //flex: 1,
        height: 50,
        alignSelf: 'center',
        backgroundColor: '#F8F8FF',
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
    line: {
        height: 1,
        alignSelf: 'stretch',
        backgroundColor: '#708090',
    },
});

module.exports = HealthTools;
