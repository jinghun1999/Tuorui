/**
 * Created by tuorui on 2016/9/7.
 */
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Head from '../../commonview/Head';
import Loading from '../../commonview/Loading';
import IconButton from '../../commonview/HomeIcon';
import InspectQuery from './InspectQuery';
class MyEquipment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isHasData: true,
            equipmentNo:'H0118FE34F3982A'
        }
    }

    _InspectQuery(){
        var _this=this;
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'InspectQuery',
                component: InspectQuery,
                params: {
                    headTitle: '检测结果查询',
                    equipmentNo:_this.state.equipmentNo
                }
            })
        }
    }

    _onBack() {
        let _this = this;
        const { navigator } = _this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        let body = (<Loading type={'text'}/>);
        if (this.state.isHasData) {
            body =(
                <View style={{flex:1,alignItems:'center',marginTop:0}}>
                    <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'#FFFAFA',height:50}}>
                        <Text>当前设备:{this.state.equipmentNo}</Text>
                    </View>
                    <View style={{flexDirection:'row',width:200,height:100}}>
                        <IconButton text="激活设备" iconName={'md-people'} iconColor={'#FFB6C1'}/>
                        <IconButton text="检测查询" iconName={'ios-paper'} iconColor={'#6666CC'} onPress={this._InspectQuery.bind(this)}/>
                    </View>
                    <View style={{flexDirection:'row',width:200,height:100}}>
                        <IconButton text="检测说明" iconName={'ios-color-palette'} iconColor={'#66CCFF'}/>
                        <IconButton text="敬请期待" iconName={'ios-medkit'} iconColor={'#66CCFF'}/>
                    </View>
                </View>
            )
        }
        else{
            body=(
                <View style={styles.PromptContainer}>
                    <View style={styles.PromptBody}>
                       <Text>抱歉，您还没有绑定设备！</Text>
                    </View>
                </View>
            )

        }
        return (
            <View style={{flex:1}}>
                <Head title={this.props.headTitle} canAdd={false} canBack={true}
                      onPress={this._onBack.bind(this)}/>
                {body}
            </View>
        )
    }
}
const styles=StyleSheet.create({
    PromptContainer:{
        flex:1,
        alignItems:'center',
        marginTop:20
    },
    PromptBody:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFE1FF',
        borderRadius: 6,
        borderColor: '#FFDAB9',
        width: 300,
        height: 40,
        fontSize: 15,
        fontWeight: 'bold'
    }
});
module.exports = MyEquipment;