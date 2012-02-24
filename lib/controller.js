
var manaslu = require('manaslu'),
    colors = require('colors'),
    fs = require('fs')

var basecamp

function configure(conf) {
  basecamp = manaslu.connect(conf)  // body...
}


var cmds = {
  '--help': {
    takes: {},
    fn: function() {
      console.log('Available commands:');
      console.log(([
        'configure',
        'projects',
        'todolists'
      ]).join('\n').green);
    }
  },
  'configure': {
    takes: {
      '--help': true,
      '-uri': null,
      '-token': null
    },
    help: (function() {
      return "Usage: makalu configure [".green+"options".yellow+"]\n\n".green+
             "Options: \n".yellow+
             "-uri \t Url for your basecamp headquarters\n".yellow+
             "-token \t Your personal basecamp api token. Found under My Info at your basecamp headquarters\n".yellow
    })(),
    fn: function(help, baseUrl, token) {
      if(help) {
        console.log(cmds['configure']['help'])
        return
      }
      if(!baseUrl) {
        console.log('-uri parameter missing'.red);
        return
      }
      if(!token) {
        console.log('-token parameter missing'.red); 
        return
      }
      fs.writeFile(process.env.HOME+'/makalu_conf.json', JSON.stringify({
        'baseUrl': baseUrl,
        'token': token
      }), function(err) {
        if(err) {
          console.log(err.red);
          return
        }
        console.log('Conf file set up in:'.grey);
        console.log((process.env.HOME+'/makalu_conf.json').green);
      })
    }
  },
  'projects': {
    takes: { },
    fn: function() {
      basecamp.Project.all(function(err, projects) {
        if(err) {
          console.log(''+err.red);
        } 
        else {
          for (var i = projects.length - 1; i >= 0; i--) {
            console.log(projects[i]['name'].green);
          };
        }
      })
    }
  },
  'todolists': {
    takes: {
      '--help': true,
      '-p': null
    },
    help: (function() {
      return "Usage: makalu todolists [".green+"options".yellow+"]\n\n".green+
             "Options: \n".yellow+
             "-p \t Project name, can be in all lowercase, stringify if spaces.\n".yellow
    })(),
    fn: function(help, projectname) {
      if(help) {
        console.log(cmds['todolists']['help'])
        return
      }
      if(!projectname) {
        console.log('No -p "projectname" specified'.red);
        return
      }
      console.log('..Searching for project..'.white);
      basecamp.Project.findByName(projectname, function(err, project) {
        if(err) {
          console.log('!ERR: '+err.red)
          return
        }
        console.log('Found project!'.green);
        console.log('..getting todolists..'.white);
        project.todoLists(function(err) {
          var i,
              todolist;
          if(err) {
            console.log('!ERR: '+err.red)
            return
          }
          console.log('\n--TODO LISTS--'.rainbow);
          for(i = 0; i < project.todoLists.length; i++) {
            todolist = project.todoLists[i]
            console.log(todolist.name.green);
            return
          }
        })
      })
    }
  },
  'tracktime': {
    takes: {
      '--help': true,
      '-p': null,
      '-d': null,
      '-h': null,
      '-m': null
    },
    help: (function() {
      return "Usage: bc tracktime [".green+"options".yellow+"]\n\n".green+
             "Options: \n".yellow+
             "-p \t Project name, can be in all lowercase, stringify if spaces.\n".yellow+
             "-d \t Date, defaults to current date\n".yellow+
             "-h \t Hours, ex: 1 or 2.5\n".yellow+
             "-m \t Message for the work done. Description.".yellow
    })(),
    fn: function(help, projectname, date, hours, desc) {
      if(help) {
        return console.log(cmds['tracktime']['help'])
      }
      if(!projectname) {
        return console.log('No -p "projectname" specified'.red);
      }
      if(!hours) {
        return console.log('No hours -h specified'.red) 
      }
      console.log('..Searching for project..'.white);
      basecamp.Project.findByName(projectname, function(err, project) {
        var project;
        if(err) {
          return console.log('!ERR: '+err.red);
        }
        if(!project) {
          return console.log('Could not find the project'.red)
        }
        console.log('Found project!'.green);
        console.log('..Getting your userdata..'.white);
        basecamp.Person.me(function(err, me) {
          if(err) {
            return console.log('Could not find the user'.red)   
          }
          console.log('Found user!'.green);
          console.log('..tracking time..'.white);
          project.trackTime(me, date, hours, desc, function(err) {
            if(err) {
              return console.log('!ERR: '+err.red);
            }
            return console.log('Tracked time!'.green);
          })
        })
      })
    }
  }
}

function execCommand (cmd, args) {
  var argArray,
      i;
  argArray = []
  i = 0
  if(!cmds[cmd]) {
    return console.log('No command specified'.red);
  }
  for(var argname in cmds[cmd].takes) {
    if(argname in args) {
      if((argname in args) && !args[argname]) {
        argArray[i] = cmds[cmd].takes[argname]
      }
      else {
        argArray[i] = args[argname] 
      }
    }
    else {
      argArray[i] = null
    }
    i++
  }
  cmds[cmd].fn.apply(this, argArray)
}


module.exports = {
  configure: configure,
  execCommand: execCommand
}










