'use strict';
import React, { Component, } from 'react';
import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';
let API_Service = 'http://test.tuoruimed.com/service/api';
let API_Auth = 'http://test.tuoruimed.com/auth/api';
let WEB_HOST = 'http://120.24.89.243/trweb';
let API_APP = 'http://120.24.89.243:20000/api';
var storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,
    storageBackend: AsyncStorage,
    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: null, //1000 * 3600 * 24,
    enableCache: true,
    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync同步方法，无缝返回最新数据。
    sync: {},
});
var GLOBAL = {
    WEB: WEB_HOST,
    HOST: API_Service,
    APIAPP: API_APP,
    LOGIN: API_Auth + '/ad',
    SAVESALES: API_Service + '/Store_DirectSell/DirectSellBillSave',
    GETGUEST: API_Service + '/gest/GetModelListWithSort',
};
global.storage = storage;
global.CONSTAPI = GLOBAL;
module.exports = GLOBAL;
