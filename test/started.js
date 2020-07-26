const tcpPortUsed = require('tcp-port-used')
const { remote } = require('webdriverio')
const defaultPort = 4444

exports.geckodriver = {
  started: test => {
    const port = +process.env.GECKODRIVER_PORT || defaultPort
    tcpPortUsed
      .check(port)
      .then(used => test.ok(used, `port ${port} is used`))
      .catch(error => {
        console.error(error.stack)
        test.ok(false, error.message)
      })
      .finally(() => test.done())
  },
  works: test => {
    const port = +process.env.GECKODRIVER_PORT || defaultPort
    remote({
      port,
      logLevel: 'warn',
      capabilities: {
        browserName: 'firefox',
        'moz:firefoxOptions': {
          args: ['-headless']
        }
      }
    })
      .then(browser => {
        test.ok(true, 'browser is up')
        return browser.deleteSession()
      })
      .catch(error => {
        console.error(error.stack)
        test.ok(false, error.message)
      })
      .finally(() => test.done())
  }
}
