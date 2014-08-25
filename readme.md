grunt-travis-execute 1.0.0
===============
.travis command excute.


## install
```cmd
  npm install grunt-travis-excute --save
```

## use
```javascript
  module.exports = function (grunt) {
    grunt.initConfig({
      // initconfig...
    });
  });
  grunt.loadNpmTasks('grunt-travis-excute');

  grunt.registerTask('travis', ['travisExecute']);
```
and execute command.
```cmd
  grunt travis
```

## option
```javascript
  travisExecute:{
    travis: './.travis.yml' //default: './.travis.yml'
  }
```

## flags example
```javascript
  grunt.registerTask('travis', ['travisExecute']); // all flags
  grunt.registerTask('build', ['travisExecute:install:before_script']);
  grunt.registerTask('test', ['travisExecute:script']);
  grunt.registerTask('reset', ['travisExecute:after_script']);
  // etc..
```

## next version plan
+ source cleanup?(정리)
+ :install~ , :install~script etc...
+ after_success, after_failure support
+ more options support

-------

 ### Thank you
