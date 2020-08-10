# grunt-geckodriver
[![NPM version](https://badge.fury.io/js/grunt-geckodriver.png)](http://badge.fury.io/js/grunt-geckodriver)
[![Build Status](https://travis-ci.org/prantlf/grunt-geckodriver.png)](https://travis-ci.org/prantlf/grunt-geckodriver)
[![codecov](https://codecov.io/gh/prantlf/grunt-geckodriver/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/grunt-geckodriver)
[![codebeat badge](https://codebeat.co/badges/1d016503-df5e-41ac-9625-66bb238e236b)](https://codebeat.co/projects/github-com-prantlf-grunt-geckodriver-master)
[![Dependency Status](https://david-dm.org/prantlf/grunt-geckodriver.svg)](https://david-dm.org/prantlf/grunt-geckodriver)
[![devDependency Status](https://david-dm.org/prantlf/grunt-geckodriver/dev-status.svg)](https://david-dm.org/prantlf/grunt-geckodriver#info=devDependencies)
[![peerDependency Status](https://david-dm.org/prantlf/grunt-geckodriver/peer-status.svg)](https://david-dm.org/prantlf/grunt-geckodriver#info=peerDependencies)

[![NPM Downloads](https://nodei.co/npm/grunt-geckodriver.png?downloads=true&stars=true)](https://www.npmjs.com/package/grunt-geckodriver)

Controls Firefox using the WebDriver interface via geckodriver without Selenium.

If you use a modern test driver like [webdriverio], you will not need [Selenium] to run the tests, because the browser driver itself implements the [WebDriver] interface. This module provides a [Grunt] multi-task for installing, starting and stopping the [geckodriver] executable. You take care of installing Firefox.

This task, [grunt-chromedriver] and [grunt-safaridriver] can be used as a replacement for [grunt-selenium-standalone] for tasks like [grunt-html-dom-snapshot], to simplify the whole scenario by removing [Selenium] and [Java] from the requirements.

## Installation

You need [node >= 10][node], [npm] and [grunt >= 1.0.0][Grunt] installed and
your project build managed by a [Gruntfile]. If you have not used Grunt before,
be sure to check out the [Getting Started] guide, as it explains how to create
a Gruntfile as well as install and use Grunt plugins.  Once you are familiar
with that process, you may install this plugin with this command:

    npm install grunt-geckodriver --save-dev

## Configuration

Add the `geckodriver` entry with one or more tasks to the options of the
`grunt.initConfig` method in `Gruntfile.js`:

```js
grunt.initConfig({
  geckodriver: {
    default: {}
  }
});
```

Load the plugin:

```javascript
grunt.loadNpmTasks('grunt-geckodriver');
```

Add use the task to start and stop the browser driver before and after the tests:

```js
grunt.registerTask('default', ['geckodriver:default:start', ..., 'geckodriver:default:stop']);
```

### Options

Default task options support the most usual usage scenario:

```js
geckodriver: {
  default: {
    port: 4444,
    findAvailablePort: false,
    args: [],
    force: false
  }
}
```

#### port
Type: `Number`
Default value: `4444`

The port for the `geckodriver` to listen to. If `findAvailablePort` is set to
`true`, this port will be used to start the search for a free port with.

### findAvailablePort
Type: `Boolean`
Default value: `false`

If set to `true`, the value of `port` will be used to start the search for a
free port with.

### args
Type: `Array<String>`
Default value: `[]`

Command-line arguments for the `geckodriver` executable. Available ones:

        --connect-existing  Connect to an existing Firefox instance
        --jsdebugger        Attach browser toolbox debugger for Firefox
    -v                      Log level verbosity (-v for debug and -vv for trace level)
    -b, --binary <BINARY>   Path to the Firefox binary
        --log <LEVEL>       Set Gecko log level [possible values: fatal, error,
                            warn, info, config, debug, trace]
        --marionette-host <HOST>  Host to use to connect to Gecko
                                  [default: 127.0.0.1]
        --marionette-port <PORT>  Port to use to connect to Gecko
                                  [default: system-allocated port]
        --host <HOST>  Host IP to use for WebDriver server [default: 127.0.0.1]
    -p, --port <PORT>  Port to use for WebDriver server [default: 4444]

### force
Type: `Boolean`
Default value: `false`

If set to `true`, it suppresses failures. Instead of making the Grunt fail,
the errors will be written only to the console.

### Events

If `findAvailablePort` is set to `true`, the actual chosen port can be read by:

```js
grunt.config.get(`geckodriver.<task-name>.port`)
```

As soon es the browser driver process starts listening, an event will be
triggered with the actually chosen port:

```js
grunt.event.on(`geckodriver.<task-name>.listening`, port => {...})
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style.  Add unit tests for any new or changed functionality. Lint and test
your code using Grunt.

## License

Copyright (c) 2020 Ferdinand Prantl

Licensed under the MIT license.

[node]: https://nodejs.org
[npm]: https://npmjs.org
[Grunt]: https://gruntjs.com
[Gruntfile]: https://gruntjs.com/sample-gruntfile
[Getting Gtarted]: https://github.com/gruntjs/grunt/wiki/Getting-started
[Selenium]: http://www.seleniumhq.org/download/
[geckodriver]: https://github.com/giggio/node-geckodriver#readme
[webdriverio]: http://webdriver.io/
[Java]: https://java.com/en/download/
[WebDriver]: https://www.w3.org/TR/webdriver/
[grunt-html-dom-snapshot]: https://github.com/prantlf/grunt-html-dom-snapshot#readme
[grunt-selenium-standalone]: https://github.com/zs-zs/grunt-selenium-standalone#readme
[grunt-chromedriver]: https://github.com/prantlf/grunt-chromedriver#readme
[grunt-safaridriver]: https://github.com/prantlf/grunt-safaridriver#readme
