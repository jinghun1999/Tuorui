/**
 * Created by User on 2016-09-06.
 */

'use strict';
import React, {Component} from 'react';
import{
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    InteractionManager,
    } from 'react-native';
import Head from '../../commonview/Head';
import Icon from 'react-native-vector-icons/Ionicons';

class UC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        };
    }
    _onBack() {
        const { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Head title={this.props.headTitle} canBack={true} onPress={this._onBack.bind(this)}/>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
});

module.exports = UC;