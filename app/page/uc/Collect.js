/**
 * Created by tuorui on 2016/12/1.
 */
'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Head from '../../commonview/Head';
import { toastShort } from '../../util/ToastUtil';
class Collect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
                <Head title="我的收藏" canBack={true} onPress={this._onBack.bind(this)}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{flex:1},
});
module.exports = Collect;