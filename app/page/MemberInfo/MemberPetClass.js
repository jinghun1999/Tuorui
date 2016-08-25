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
import Head from '../../commonview/Head';
import IconView from '../../commonview/ComIconView';
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
                    <View style={styles.iconViewStyle}>
                        <IconView text="会员列表" icon={'md-contact'} color={'#FF6666'} IconColor={'white'}
                                  onPress={this._more.bind(this)}/>
                        <IconView text="添加会员" icon={'md-person-add'} color={'#4F94CD'} IconColor={'white'}
                                  onPress={this._more.bind(this)}/>
                        <IconView text="修改会员" icon={'ios-create'} color={'#CD8500'} IconColor={'white'}
                                  onPress={this._more.bind(this)}/>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.container}>
                    <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
                    <View style={styles.iconViewStyle}>
                        <IconView text="宠物列表" icon={'md-paw'} color={'#8968CD'} IconColor={'white'}
                                  onPress={this._more.bind(this)}/>
                        <IconView text="添加宠物" icon={'md-add-circle'} color={'#66CDAA'} IconColor={'white'}
                                  onPress={this._more.bind(this)}/>
                        <IconView text="修改宠物" icon={'md-create'} color={'#FF6666'} IconColor={'white'}
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
    iconViewStyle:{
    },
});
module.exports = MemberPetClass;