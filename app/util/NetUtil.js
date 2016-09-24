'use strict';
import React, {
    Component,
    } from 'react';
import Util from './Util';
import Global from './Global';
class NetUtil extends React.Component {

    static postJson(url, data, header, callback) {
        if (!header) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
        } else {
            if (!header.hasOwnProperty('Accept')) {
                header['Accept'] = 'application/json';
            }
            if (!header.hasOwnProperty('Content-Type')) {
                header['Content-Type'] = 'application/json';
            }
        }
        var fetchOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify(data)
        };
        try {
            fetch(url, fetchOptions)
                .then((response) => response.text())
                .then((responseText) => {
                    let result = JSON.parse(responseText);
                    callback(result);
                }).done();
        } catch (e) {
            result = {Sign: false, Message: '【解析远程数据失败】'};
        }
    }

    //get请求
    static get(url, header, callback) {
        if (!header) {
            header = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
        } else {
            if (!header.hasOwnProperty('Accept')) {
                header['Accept'] = 'application/json';
            }
            if (!header.hasOwnProperty('Content-Type')) {
                header['Content-Type'] = 'application/json';
            }
        }
        var fetchOptions = {
            method: 'GET',
            headers: header
        };
        try {
            fetch(url, fetchOptions)
                .then((response) => response.text())
                .then((responseText) => {
                    let result = {};
                    try {
                        result = JSON.parse(responseText);
                    } catch (e) {
                        result = {Sign: false, Message: '【解析JSON失败】' + responseText};
                    }
                    callback(result);
                }).done();
        } catch (e) {
            return e;
        }
    }

    static getAuth(success, error) {
        storage.load({
            key: 'USER',
            autoSync: true,
            syncInBackground: true
        }).then(user => {
            storage.load({
                key: 'HOSPITAL',
                autoSync: false,
                syncInBackground: false
            }).then(hos=> {
                success(user.user, hos);
            }).catch(e=> {
                success(user.user, {});
            })
        }).catch(err => {
            switch (err.name) {
                case 'NotFoundError':
                    error('not found user');
                    break;
                case 'ExpiredError':
                    error('user login expired');
                    break;
                default :
                    error('请重新登陆应用');
                    break;
            }
        });
    }

    static url_healthmonitnorm(checkItemCode) {
        const time = Util.getTime();
        const ul = Global.HOST + "?token=" + Util.getToken(time);
        return ul;
    }

    static headerAuthorization(mobile, hospitalcode, token) {
        return 'Mobile ' + Util.base64Encode(mobile + ':' + hospitalcode + ":" + token);
    }

    static headerClientAuth(user, hos) {
        let hoscode = '*';
        if (hos && hos.hospital) {
            hoscode = hos.hospital.Registration
        }
        return {
            'Authorization': 'Mobile ' + Util.base64Encode(user.Mobile + ':' + hoscode + ":" + user.Token.token)
        }
    }

    static login(phone, pwd, code, callback) {
        NetUtil.get(CONSTAPI.Auth + "/ad?identity=" + phone + "&password=" + pwd + "&verCode=" + code + "&type=m", false, function (lg) {
            if (lg.Sign && lg.Message) {
                /*保存登陆信息*/
                storage.save({
                    key: 'LoginData',
                    rawData: {
                        identity: phone,
                        password: pwd,
                    },
                });
                /*保存用户信息*/
                storage.save({
                    key: 'USER',
                    rawData: {
                        user: lg.Message,
                    },
                    expires: 1000 * (lg.Message.Token.expires_in - 60),
                });
                /*保存用户默认医院*/
                if (lg.Message.HospitalId != null) {
                    let hos = {};
                    lg.Message.Hospitals.forEach(function (v, i, d) {
                        if (v.ID === lg.Message.HospitalId) {
                            hos = v;
                        }
                    });
                    storage.save({
                        key: 'HOSPITAL',
                        rawData: {
                            hospital: hos,
                        }
                    });
                }
                callback(true)
            } else {
                callback(false, lg.Exception)
            }
        });
    }
}

module.exports = NetUtil;
