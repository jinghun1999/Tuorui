'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    View,
    Alert
    } from 'react-native';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';
class MyAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberNumber: 123,
        };
    }

    _onBack() {
        var _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Head title="我的信息" canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            style={{flex:1, backgroundColor:'#efefef'}}>
                    <View style={{height:30, justifyContent:'center', paddingLeft:10}}>
                        <Text>基本信息</Text>
                    </View>
                    <View style={styles.basicBox}>
                        <TouchableOpacity onPress={()=>{Errorr('')}} style={styles.headBox}>
                            <Text style={{width:100,}}>头像</Text>
                            <View style={{flex:1, justifyContent:'flex-end'}}>
                                <Image source={require('../../../image/Head_physician_128px.png')} style={styles.imageStyle}/>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.headBox}>
                            <View style={{width:100,}}>
                                <Text style={styles.title}>姓名</Text>
                            </View>
                            <View style={{flex:1,justifyContent:'flex-end', backgroundColor:'blue'}}>
                                <Text>张三丰</Text>
                                <View>
                                    <Icon name={'ios-search'} size={20} color={'#666'}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    basicBox: {
        backgroundColor:'#fff',
        borderTopWidth:StyleSheet.hairlineWidth,
        borderTopColor:'#ccc',
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#ccc',
    },
    headBox:{
        flexDirection:'row',
        flex:1,
        alignItems:'center',
        paddingBottom:10,
        paddingTop:10,
        marginLeft:10,
        marginRight:10,
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#ccc',
    },
    imageStyle: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    title:{

    }
});

module.exports = MyAccount;