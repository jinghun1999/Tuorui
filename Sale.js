/**
 * Created by tuorui on 2016/7/15.
 */
'use strict';
import React, {Component} from 'react';
import{
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    View
} from 'react-native';
class Sale extends Component {
    onPress() {
        //或者写成 const navigator = this.props.navigator;
        const { navigator } = this.props;

        if (this.props.getSomething) {
            var flag = 'Axiba002'
            this.props.getSomething(flag);
        }
        if (navigator) {
            navigator.pop();
        }
    }

    render() {
        return (
            <View>
                <View style={styles.home}>
                    <TouchableHighlight onPress={this.onPress}>
                        <Text>push sucess!I get {this.props.id},i want back!</Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    home: {
        paddingTop: 74,

    },
})
module.exports = Sale;