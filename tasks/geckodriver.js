const portscanner = require('portscanner')
const tcpPortUsed = require('tcp-port-used')

const defaultPort = 4444

function getPortFromArgs (args) {
  let port
  if (args.some(arg => (port = /--port=(\d+)/.exec(arg)))) return +port[1]
  args.some(arg => {
    if (arg === '--port' || arg === '-p') port = true
    else if (port) {
      port = +arg
      return true
    }
  })
  return port || defaultPort
}

function finalizeArgs (options) {
  const args = options.args || []
  const port = options.port || getPortFromArgs(args)
  const promise = options.findAvailablePort ? portscanner.findAPortNotInUse(port) : Promise.resolve(port)
  return promise.then(port => {
    if (port === defaultPort) return { args, port }
    let skip
    return {
      args: args
        .filter(arg => {
          if (skip) {
            skip = false
            return false
          }
          if (arg === '-p') {
            skip = true
            return false
          }
          return !arg.startsWith('--port=')
        })
        .concat([`--port=${port}`]),
      port
    }
  })
}

let geckodriver

module.exports = grunt => {
  grunt.registerMultiTask('geckodriver',
    'Grunt task to controls Firefox using the WebDriver interface via geckodriver.',
    function (command) {
      /* istanbul ignore next */
      if (!command) grunt.fatal('command verb missing; append ":start" or ":stop" to the task name')
      switch (command.toLowerCase()) {
        case 'start': start(this); break
        case 'stop': stop(); break
        /* istanbul ignore next */
        default: grunt.fatal(`invalid command verb: "${command}"; append ":start" or ":stop" to the task name`)
      }

      function start (task) {
        /* istanbul ignore next */
        if (geckodriver) grunt.fatal('GeckoDriver already started.')
        geckodriver = require('geckodriver')
        const done = task.async()
        const options = Object.assign({
          findAvailablePort: false,
          args: [],
          force: false
        }, task.data)
        const target = this.target
        let usedPort
        finalizeArgs(options)
          .then(({ args, port }) => {
            usedPort = port
            grunt.config.set(`geckodriver.${target}.port`, port)
            geckodriver.start(args)
            return tcpPortUsed.waitUntilUsed(port, 200, 10000)
          })
          .then(() => {
            grunt.event.emit(`geckodriver.${target}.listening`, usedPort)
            process.on('exit', stop)
          })
          .catch(/* istanbul ignore next */ function (error) {
            grunt.verbose.error(error.stack)
            const warn = options.force ? grunt.log.warn : grunt.fail.warn
            warn(`geckodriver failed: ${error.message}`)
          })
          .finally(() => done())
      }

      function stop () {
        if (geckodriver) {
          grunt.log.writeln('Stopping GeckoDriver.')
          geckodriver.stop()
          geckodriver = null
          process.off('exit', stop)
        }
      }
    })
}
