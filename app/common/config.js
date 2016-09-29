'use strict'

module.exports = {
  header: {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  api: {
    base: 'http://rap.taobao.org/mockjs/7700/',
    creations: 'api/creations',
    up: 'api/up'
  }
}
