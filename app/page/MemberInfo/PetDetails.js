/**
 * Created by tuorui on 2016/8/29.
 */

'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    View,
    Picker,
    ListView,
    Dimensions,
    DatePickerAndroid,
    TouchableOpacity,
} from 'react-native';
import Head from '../../commonview/Head';
import FormInput from '../../commonview/FormInput';
class PetDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: '编辑',
            enable: false,
        }
    };

    _onBack() {
        let _this = this;
        const {navigator}=_this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    _editInfo() {
        let _this = this;
        let edit = _this.state.edit;
        if (edit == '编辑') {
            _this.setState({
                enable: true,
                edit: '保存',
            })
        } else {
            alert('保存成功');
            _this.setState({
                enable: false,
                edit: '编辑',
            })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canAdd={true} canBack={true} edit={this.state.edit}
                      onPress={this._onBack.bind(this)}
                      editInfo={this._editInfo.bind(this)}/>
                <View style={styles.basicStyle}>
                    <View style={styles.basicContentStyle}>
                        <Text>{this.props.name}</Text>
                        <View style={{height:50,}}>
                            <FormInput value={this.props.name}
                                       title="宠物昵称"
                                       enabled={this.state.enable}
                                       onChangeText={(text)=>{this.setState({ memberName: text })}}
                            />
                        </View>
                        <View style={{height:50,}}>
                            <FormInput value={this.props.name}
                                       title="姓名"
                                       enabled={this.state.enable}
                                       onChangeText={(text)=>{this.setState({ memberName: text })}}
                            />
                        </View>
                    </View>
                    <View style={styles.imageStyle}>
                        <Image source={require('./../../../image/pet.jpg')}
                               style={{width:200,height:200,marginRight:20,}}
                        />
                    </View>
                </View>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {},
    basicStyle: {
        flex: 1,
        flexDirection: 'row',
    },
    basicContentStyle: {
        flex: 1,
        marginLeft: 10,
    },
    imageStyle: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
    },
})
module.exports = PetDetails