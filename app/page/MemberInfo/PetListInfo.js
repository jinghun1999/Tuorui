/**
 * Created by tuorui on 2016/8/31.
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
    ListView,
    ScrollView,
} from 'react-native';
import Head from '../../commonview/Head';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import VaccineInfo from './VaccineInfo';
class PetListInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            petDataSource: null,
            loaded:false,
        }
    }

    componentDidMount() {
        var _this = this;
        _this.timer = setTimeout(
            () => {
                _this._fetchData();
            }, 500
        )
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    _fetchData() {
        var _this = this;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = {
            'memberName':'张三',
            'memberPhone':'13838383338',
            'data': [
                {
                    'petId': 1,
                    'petName': '小金',
                    'variety':'金毛',
                    'petCaseNum':'20160831001',
                    'birthDate':'2016-08-18',
                    'sterilizationState':1,
                    'petSex':'雌性',
                    'petColor':'gold',
                    'petType':'middle',
                    'petState':'alive',
                    'image':'./../../../image/pet.jpg',
                    'reMarks':'没有更多备注了',

                },
                {
                    'petId': 2,
                    'petName': '娃娃',
                    'variety':'吉娃娃',
                    'petCaseNum':'20160831001',
                    'birthDate':'2008-08-18',
                    'sterilizationState':1,
                    'petSex':'雌性',
                    'petColor':'white',
                    'petType':'small',
                    'petState':'alive',
                    'image':'./../../../image/pet.jpg',
                    'reMarks':'没有更多备注了',
                },
                {
                    'petId': 3,
                    'petName': '家虎',
                    'variety':'藏獒',
                    'petCaseNum':'20160831001',
                    'birthDate':'1988-08-18',
                    'sterilizationState':1,
                    'petSex':'雄性',
                    'petColor':'black',
                    'petType':'big',
                    'petState':'alive',
                    'image':'./../../../image/pet.jpg',
                    'reMarks':'没有更多备注了',
                },
                {
                    'petId': 4,
                    'petName': '茱莉',
                    'variety':'茶杯犬',
                    'petCaseNum':'20160831001',
                    'birthDate':'2010-08-01',
                    'sterilizationState':1,
                    'petSex':'雌性',
                    'petColor':'yellow',
                    'petType':'small',
                    'petState':'alive',
                    'image':'./../../../image/pet.jpg',
                    'reMarks':'没有更多备注了',
                },
            ]
        };
        _this.setState({
            petDataSource: ds.cloneWithRows(data.data),
            memberName:data.memberName,
            memberPhone:data.memberPhone,
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
    pressRow(pet){
        let _this=this;
        const {navigator}=_this.props;
        if(navigator){
            navigator.push({
                name:'VaccineInfo',
                component:VaccineInfo,
                params:{
                    headTitle:'宠物详情',
                    memberName:_this.state.memberName,
                    memberPhone:_this.state.memberPhone,
                    petSource:pet,
                }
            })
        }
    }
    _renderVaccine(pet){
        return(
            <TouchableOpacity
                style={{ flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this.pressRow(pet)}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}>{pet.petName}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>品种: {pet.variety}</Text>
                        <Text style={{flex: 1,}}>出生日期: {pet.birthDate}</Text>
                        <Text style={{flex: 1,}}>性别: {pet.petSex}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        var body;
        if (!this.state.loaded) {
            body = (
                <View style={styles.loadingBox}>
                    <Bars size={10} color="#1CAFF6"/>
                </View>
            )
        } else {
            body = (
                <ListView dataSource={this.state.petDataSource} enableEmptySections={true}
                          renderRow={this._renderVaccine.bind(this)}/>
            )
        }
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <View>
                    {body}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingBox: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})
module.exports = PetListInfo;