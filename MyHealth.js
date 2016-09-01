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
    View,
    Navigator,
} from 'react-native';
import Head from './app/commonview/Head';
import IconView from './app/commonview/ComIconView';
import TopScreen from './HomePage';
import DrugHandBook from './app/page/HomePage/InfoClass';
class MyHealth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DurgSource:[],
        };
    }
    //药品手册跳转
    _durgHandbook(){
        const { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'DrugHandBook',
                component: DrugHandBook,
            });
        }
    }
    _bbb(){
        alert("bbb");
    }
    _ccc(){
        alert("ccc");
    }
    _ddd(){
        alert("ddd");
    }
    _eee(){
        alert("eee");
    }
    render() {
        return (
            <View style={styles.container}>
                <Head title='知识库'/>
                <IconView text="药品手册" icon={'book'} color={'white'} IconColor={'orange'}  onPress={this._durgHandbook.bind(this)} />
                <IconView text="化验手册" icon={'opacity'} color={'white'} IconColor={'#CC3333'} onPress={this._bbb.bind(this)}/>
                <IconView text="诊断手册" icon={'local-hospital'} color={'white'} IconColor={'#66FFFF'} onPress={this._ccc.bind(this)}/>
                <IconView text="咨询信息" icon={'tag-faces'} color={'white'} IconColor={'#99CC66'} onPress={this._ddd.bind(this)}/>
                <IconView text="我要投稿" icon={'library-books'} color={'white'} IconColor={'#993399'} onPress={this._eee.bind(this)}/>
                    <View style={styles.view}>
                        <Image source={require('./image/health_test.png')}
                               style={styles.imageIcon}/>
                        <Text style={styles.t0}>健康监测</Text>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.view}>
                        <Image source={require('./image/health_report.png')}
                               style={styles.imageIcon}/>
                        <Text style={styles.t0}>健康报告</Text>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.view}>
                        <Image source={require('./image/base_log.png')}
                               style={styles.imageIcon}/>
                        <Text style={styles.t0}>健康日志</Text>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.view}>
                        <Image source={require('./image/health_manage_task.png')}
                               style={styles.imageIcon}/>
                        <Text style={styles.t0}>健康任务</Text>
                        <Image source={require('./image/arrows_right.png')}
                               style={styles.imageArr}/>
                    </View>
                    <View style={styles.view}>
                        <Image source={require('./image/health_manage.png')}
                               style={styles.imageIcon}/>
                        <Text style={styles.t0}>健康目标</Text>
                            <Image source={require('./image/arrows_right.png')}
                                   style={styles.imageArr}/>
                    </View>

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
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderBottomColor:'#ccc',
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
