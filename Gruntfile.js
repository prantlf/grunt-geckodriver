'use strict'

module.exports = function (grunt) {
  const coverage = grunt.option('coverage')
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

    instrument: {
      files: 'tasks/**/*.js',
      options: {
        lazy: true,
        basePath: 'coverage/'
      }
    },

    storeCoverage: {
      options: { dir: 'coverage' }
    },

    makeReport: {
      src: 'coverage/coverage.json',
      options: {
        type: 'lcov',
        dir: 'coverage',
        print: 'detail'
      }
    },

    nodeunit: {
      started: ['test/started.js'],
      stopped: ['test/stopped.js']
    }
  })

  grunt.loadNpmTasks('grunt-contrib-nodeunit')
  grunt.loadNpmTasks('grunt-istanbul')
  grunt.loadNpmTasks('grunt-standard')
  grunt.loadTasks(coverage ? 'coverage/tasks' : 'tasks')

  process.env.GECKODRIVER_PORT = undefined
  grunt.registerTask('switchPort', 'Grunt task switching the geckodriver port.', function () {
    process.env.GECKODRIVER_PORT = alternativePort
  })

  let test = [
    'standard', 'nodeunit:stopped', 'geckodriver:quiet:start',
    'nodeunit:started', 'geckodriver:quiet:stop',
    'nodeunit:stopped', 'geckodriver:verbose:start', 'switchPort',
    'nodeunit:started', 'geckodriver:verbose:stop', 'nodeunit:stopped',
    'geckodriver:anotherPort:start', 'nodeunit:started',
    'geckodriver:anotherPort:stop', 'nodeunit:stopped',
    'geckodriver:otherPort:start', 'nodeunit:started'
  ]
  if (coverage) test = test.concat(['storeCoverage', 'makeReport'])
  grunt.registerTask('default', test)
}
