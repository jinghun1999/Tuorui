/**
 * Created by tuorui on 2016/7/27.
 */
import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    ListView,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native';
import Head from './../../commonview/Head';
import Icon from './../../commonview/HomeIcon';
class MemberPetClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    componentDidMount() {

    }

    //返回方法
    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentWillUnmount() {
        var _this = this;
    }

    _more() {
        alert('no more')
    }

    render() {
        var id = this.props.id;
        if (id == 1) {
            return (
                <View style={styles.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    <View style={{flexDirection:'row',}}>
                        <Icon text="会员列表" iconName={'md-contact'} iconColor={'#FF6666'}
                              onPress={this._more.bind(this)}/>
                        <Icon text="添加会员" iconName={'md-person-add'} iconColor={'#FF6666'}
                              onPress={this._more.bind(this)}/>
                        <Icon text="修改会员" iconName={'ios-create'} iconColor={'#FF6666'}
                              onPress={this._more.bind(this)}/>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    <View style={{flexDirection:'row',}}>
                        <Icon text="宠物列表" iconName={'md-paw'} iconColor={'#FF6666'}
                              onPress={this._more.bind(this)}/>
                        <Icon text="添加宠物" iconName={'md-add-circle'} iconColor={'#FF6666'}
                              onPress={this._more.bind(this)}/>
                        <Icon text="修改宠物" iconName={'md-create'} iconColor={'#FF6666'}
                              onPress={this._more.bind(this)}/>
                    </View>
                </View>
            )
        }

    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
module.exports = MemberPetClass;