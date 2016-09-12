'use strict';
import React, {
    Component
    } from 'react';

import Md5Util from './Md5Util';
var base64 = require('base-64');

class Util extends React.Component {

    static getToken(time) {
        return Md5Util.md5(time + Util.getPswId());
    }

    static getKo() {
        return '0000';
    }

    static getTime() {
        var moment = require('moment');
        return moment().format("YYYY-MM-DD HH:mm:ss");
    }

    static getPswId() {
        return '0010000app';
    }

    static tokenAndKo(map) {
        let time = Util.getTime();
        map.set('time', time);
        map.set('ko', Util.getKo());
        map.set('token', Util.getToken(time));
        return map;
    }

    static cutString(str, len, suffix) {
        if (!str) return "";
        if (len <= 0) return "";
        if (!suffix) suffix = "";
        var templen = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                templen += 2;
            } else {
                templen++
            }
            if (templen == len) {
                return str.substring(0, i + 1) + suffix;
            } else if (templen > len) {
                return str.substring(0, i) + suffix;
            }
        }
        return str;
    }

    static base64Encode(str) {
        return base64.encode(str);
    }

    static GetDateStr(adddays) {
        var dd = new Date();
        dd.setDate(dd.getDate() + adddays);//adddays
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;//获取当前月份的日期
        var d = dd.getDate();
        return y + "-" + m + "-" + d;
    }
    static guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
}

module.exports = Util;
