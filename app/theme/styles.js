/**
 * Created by User on 2016-09-19.
 */
import React, {Component} from 'react';
import { StyleSheet, } from 'react-native';
//var theme = require("./theme");
import theme from './theme';
module.exports = StyleSheet.create({
    titleText: {
        fontWeight: 'bold',
        //...theme.title,
    },
    container1: {
        background: theme.backgroundColor,
    },
    container2: {
        background: theme.backgroundColor,
    },
    content: {
        //...theme.content,
    },
});