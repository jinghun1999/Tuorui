/**
 * DEMO Native App
 * https://github.com/facebook/react-native
 * @author:TOMCHOW
 * @date：2016-07-12 0:49
 */
'use strict';

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Navigator,
    BackAndroid,
    Image,
    View
    } from 'react-native';
import Index from './Index';
class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Index />
        )
    }
}

AppRegistry.registerComponent('Demo', () => Demo);
