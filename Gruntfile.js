'use strict'

module.exports = function (grunt) {
  const alternativePort = '4446'

  grunt.initConfig({
    geckodriver: {
      quiet: {},
      verbose: { verbose: true, args: [`--port=${alternativePort}`] },
      anotherPort: { args: ['-p', alternativePort] },
      otherPort: { port: +alternativePort, findAvailablePort: true },
      fail: { args: ['--invalid'] }
    },

    standard: {
      all: {
        src: [
          'Gruntfile.js',
          'tasks/**/*.js',
          '<%= nodeunit.started %>',
          '<%= nodeunit.stopped %>'
        ]
      }
    },

    nodeunit: {
      started: ['test/started.js'],
      stopped: ['test/stopped.js']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadTasks('tasks')

  process.env.GECKODRIVER_PORT = undefined
  grunt.registerTask('switchPort', 'Grunt task switching the geckodriver port.', function () {
    process.env.GECKODRIVER_PORT = alternativePort
  })

  grunt.registerTask('default', [
    'nodeunit:stopped', 'geckodriver:quiet:start',
    'nodeunit:started', 'geckodriver:quiet:stop',
    'nodeunit:stopped', 'geckodriver:verbose:start', 'switchPort',
    'nodeunit:started', 'geckodriver:verbose:stop', 'nodeunit:stopped',
    'geckodriver:anotherPort:start', 'nodeunit:started',
    'geckodriver:anotherPort:stop', 'nodeunit:stopped',
    'geckodriver:otherPort:start', 'nodeunit:started'
  ])
}
