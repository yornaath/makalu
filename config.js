var data = {
  baseUrl: 'wtw1.basecamphq.com',
  token: '52f2fc990bc767b667cc8be87d64cc3520bcbca7',
  username: 'gorillatron',
  password: 'mtZpqPxhe2ReHzkazYb'
}

module.exports = {
  get: function(key) {
    return data[key]
  },
  set: function(key, val) {
    data[key] = val
  }
}