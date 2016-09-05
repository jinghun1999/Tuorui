/**
 * Created by tuorui on 2016/9/5.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View,
    ListView,
    TouchableOpacity,
}from 'react-native';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import AppointDetails from './AppointDetails';
class AppointListInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            loaded: false,
        }
    }

    componentDidMount() {
        var _this = this;
        _this.timer = setTimeout(
            () => {
                _this._onFetchData();
            }, 500
        )
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _onFetchData() {
        //获取数据
        let _this = this;
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = {
            'data': [{
                'memberName': '张三',
                'memberPhone': '18866886668',
                'appointTime': '2016-09-05',
                'petName': '家虎',
                'petAge': '3',
                'registerTime': '2016-09-01',
                'appointState': '1',
            },
                {
                    'memberName': '张三',
                    'memberPhone': '18866886668',
                    'appointTime': '2016-09-07',
                    'petName': '茱莉',
                    'petAge': '2',
                    'registerTime': '2016-09-02',
                    'appointState': '2',
                },
            ]
        };
        _this.setState({
            dataSource: ds.cloneWithRows(data.data),
            loaded: true,
        })
    }

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _onAppointDetails(a) {
        let _this= this;
        const {navigator} = _this.props;
        if(navigator){
            navigator.push({
                name:'AppointDetails',
                component:AppointDetails,
                params:{
                    headTitle:'预约详情',
                    appointInfo: a,
                }
            })
        }
    }

    _onRenderRow(a) {
        let isStateBody = null;
        if (a.appointState == '1') {
            isStateBody = <View style={{marginLeft:10, width:50, height:18, borderRadius:5, backgroundColor:'#FF9900'}}>
                <Text style={{color:'#fff', textAlign:'center'}}>已确认</Text>
            </View>
        } else {
            isStateBody = <View style={{marginLeft:10, width:50, height:18, borderRadius:5, backgroundColor:'#BEBEBE'}}>
                <Text style={{color:'#fff', textAlign:'center'}}>已取消</Text>
            </View>
        }
        return (
            <TouchableOpacity style={{
            flexDirection:'row',marginLeft:15, marginRight:15,paddingTop:10, paddingBottom:10,
            borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                              onPress={()=>this._onAppointDetails(a)}>
                <View style={{flex:1,}}>
                        <Text style={{fontSize:14, fontWeight:'bold'}}>{a.petName}</Text>
                    <View style={{flexDirection:'row',marginTop:10}}>
                        <Text style={{flex: 1,}}>登记日期:{a.registerTime}</Text>
                        <Text style={{flex:1,}}>预约会诊时间:{a.appointTime}</Text>
                    </View>
                </View>
                {isStateBody}
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let body = (
            <Loading />
        );
        if (this.state.loaded) {
            body = (
                <ListView dataSource={this.state.dataSource}
                          enableEmptySections={true}
                          renderRow={this._onRenderRow.bind(this)}
                />
            );
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                {body}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
module.exports = AppointListInfo;