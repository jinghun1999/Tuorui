'use strict';
import React, { Component, } from 'react';

import Storage from './Storage';

let API_Service = 'http://test.tuoruimed.com/service/api';
let API_Auth = 'http://test.tuoruimed.com/auth/api';

let WEB_HOST = 'http://120.24.89.243/trweb';
let API_APP = 'http://120.24.89.243/trapi/api';
var GLOBAL = {
    WEB: WEB_HOST,
    HOST: API_Service,
    APIAPP: API_APP,
    Auth: API_Auth,
    SAVESALES: API_Service + '/Store_DirectSell/DirectSellBillSave',
    GETGUEST: API_Service + '/gest/GetModelListWithSort',
};
global.CONSTAPI = GLOBAL;
module.exports = GLOBAL;
