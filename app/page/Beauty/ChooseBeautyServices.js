/**
 * Created by tuorui on 2016/9/6.
 */
/**
 * Created by tuorui on 2016/9/5.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    TextInput,
    View,
    ListView,
    TouchableOpacity,
}from 'react-native';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
class ChooseBeautyServices extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded:false,
            dataSource:null,
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
                'barCode': 'WF0000000064',
                'name': '全身洗护',
                'specifications': '',
                'manufacturer': '',
                'saleUnit': '次',
                'salePrice': 100.00,
            },
                {
                    'barCode': 'WF0000000065',
                    'name': '全身剃毛',
                    'specifications': '',
                    'manufacturer': '',
                    'saleUnit': '次',
                    'salePrice': 50.00,
                },
                {
                    'barCode': 'WF0000000066',
                    'name': '全身按摩',
                    'specifications': '',
                    'manufacturer': '',
                    'saleUnit': '次',
                    'salePrice': 500.00,
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
        const {navigator}= _this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    pressRow(beauty){
        let _this =this;
        if (_this.props.getResult) {
            _this.props.getResult(beauty);
        }
        _this._onBack();
    }
    _onRenderRow(beauty){
        return(
            <TouchableOpacity
                style={{ flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this.pressRow(beauty)}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>{beauty.name}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>条码: {beauty.barCode}</Text>
                        <Text style={{flex: 1,}}>售价: {beauty.salePrice}</Text>
                        <Text style={{flex: 1,}}>单位: {beauty.saleUnit}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }
    render(){
        var body = <Loading />
        if(this.state.loaded){
            body = (
                <ListView dataSource={this.state.dataSource}
                          enableEmptySections={true}
                          renderRow={this._onRenderRow.bind(this)}
                />
            );
        }
        return(
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                {body}
            </View>
        )
    }
}
const styles= StyleSheet.create({
    container:{},
})
module.exports=ChooseBeautyServices