

module.exports = function(args) {
  var i,
      arg,
      cmdMap,
      argRegex;
  argRegex = /[\-]/
  cmdMap = {}
  for (var i = 0; i < args.length; i++) {
    arg = args[i]
    narg = args[i+1]
    if(arg.match(argRegex)) {
      if(narg && narg.match(argRegex)) {
       cmdMap[arg] = null 
      }
      else if(narg){
        cmdMap[arg] = narg 
      }
      else {
        cmdMap[arg] = null  
      }
    }
  };
  return cmdMap
}