

'use strict';
import React, {
  Component
} from 'react';
/**
*Md5加密的实现
*/
class Md5Util extends React.Component {

  static md5(data){
    var md5 = require('md5');
    return md5(data);
  }
}

module.exports = Md5Util;