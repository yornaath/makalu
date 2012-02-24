
var argParser = require('./lib/argparser'),
    controller = require('./lib/controller'),
    fs = require('fs')

var cmd = process.argv.slice(2, 3)[0]
    args = argParser(process.argv.slice(3))


module.exports.run = function() {
  fs.readFile(process.env.HOME+'/makalu_conf.json', function(err, data) {
    var conf
    if(err) {
      if(err.code == 'ENOENT' && cmd != 'configure') {
        console.log('You have not set up a conf file with the url for your basecamp hq and your personal api token'.red);
        console.log('Do so with the command '.white+'makalu configure'.green);
        console.log('See makalu configure --help for details'.grey);
        return
      }
      else if(cmd == 'configure') {
        controller.execCommand(cmd, args)
        return
      }
    }
    try {
      conf = JSON.parse(data.toString())
    }
    catch(e) {
      return console.log('Conf file contains invalid json'.red);
    }
    controller.configure(conf)
    process.nextTick(function() {
      controller.execCommand(cmd, args)
    })
  })  
}