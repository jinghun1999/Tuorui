/**
 * Created by tuorui on 2016/9/6.
 */
'use strict';
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ListView,
    ScrollView,
} from 'react-native';
import Head from '../../commonview/Head';
import Icon from '../../../node_modules/react-native-vector-icons/FontAwesome';
import Loading from '../../commonview/Loading';
class ChoosePet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            petDataSource: [],
            loaded: false,
            kw: null,
            ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
    }
    _onBack(){
        let _this=this;
        const{navigator}=_this.props;
        if(navigator){
            navigator.pop();
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

    _pressRow(pet){
        if (this.props.getResult) {
            this.props.getResult(pet);
        }
        this._onBack();
    }
    _renderPet(pet){
        return(
            <TouchableOpacity
                style={{ flexDirection:'row',marginLeft:15, marginRight:15, paddingTop:10, paddingBottom:10, borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:'#ccc'}}
                onPress={()=>this._pressRow(pet)}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:14, fontWeight:'bold'}}> {pet.petName}</Text>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{flex: 1,}}>编号: {pet.petId}</Text>
                        <Text style={{flex: 1,}}>品种: {pet.variety}</Text>
                    </View>
                </View>
                <View style={{width:20,alignItems:'center', justifyContent:'center'}}>
                    <Text><Icon name={'angle-right'} size={20} color={'#ccc'}/></Text>
                </View>
            </TouchableOpacity>
        )
    }
    _fetchData(){
        let _this =this;
        var data = {
            'data': [
                {   'petId': 1,'petName': '小金','variety':'金毛','petCaseNum':'20160831001','birthDate':'2016-08-18',
                    'sterilizationState':1,'petSex':'雌性','petColor':'gold','petType':'middle','petState':'alive',
                    'image':'./../../../image/pet.jpg','reMarks':'没有更多备注了'},
                {
                    'petId': 2,'petName': '娃娃','variety':'吉娃娃','petCaseNum':'20160831001','birthDate':'2008-08-18',
                    'sterilizationState':1,'petSex':'雌性','petColor':'white','petType':'small','petState':'alive',
                    'image':'./../../../image/pet.jpg','reMarks':'没有更多备注了',
                },
                {
                    'petId': 3,'petName': '家虎','variety':'藏獒','petCaseNum':'20160831001','birthDate':'1988-08-18',
                    'sterilizationState':1,'petSex':'雄性','petColor':'black','petType':'big','petState':'alive',
                    'image':'./../../../image/pet.jpg','reMarks':'没有更多备注了',
                },
                {
                    'petId': 4,'petName': '茱莉','variety':'茶杯犬','petCaseNum':'20160831001','birthDate':'2010-08-01',
                    'sterilizationState':1,'petSex':'雌性','petColor':'yellow','petType':'small','petState':'alive',
                    'image':'./../../../image/pet.jpg','reMarks':'没有更多备注了',
                },
            ]
        };
        _this.setState({
            petDataSource:data.data,
            loaded: true,
        })
    }

    search(txt) {
        this.setState({
            kw: txt,
            loaded: false,
        });
        this.fetchData();
    }
    render(){
        var body=<Loading />
        if (this.state.loaded) {
            body = <ListView dataSource={this.state.ds.cloneWithRows(this.state.petDataSource)}
                             enableEmptySections={true}
                             renderRow={this._renderPet.bind(this)}
            />
        }
        return(
            <View style={{flex:1}}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                <ScrollView key={'scrollView'}
                            horizontal={false}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}>
                    <View style={styles.searchRow}>
                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearButtonMode="always"
                            onChangeText={this.search.bind(this)}
                            placeholder="输入宠物名称..."
                            value={this.state.kw}
                            style={styles.searchTextInput}
                        />
                    </View>
                    {body}
                </ScrollView>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    searchRow: {
        backgroundColor: '#eeeeee',
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    searchTextInput: {
        backgroundColor: '#fff',
        borderColor: '#cccccc',
        borderRadius: 3,
        borderWidth: 1,
        height: 40,
        paddingLeft: 8,
    },

})
module.exports=ChoosePet;