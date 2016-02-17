module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '.',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'misc/test-lib/jquery-1.8.2.min.js',
      'misc/test-lib/angular.js',
      'misc/test-lib/angular-mocks.js',
      'misc/test-lib/ui-bootstrap-tpls.js',
      'misc/test-lib/es6-polyfills.js',
      'src/**/*.js',
      'template/**/*.js',
      'template/**/*.css'
    ],

    // list of files to exclude
    exclude: [
      'src/**/docs/*'
    ],

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari
    // - PhantomJS
    browsers: [
      'PhantomJS'
    ],

    // test results reporter to use
    // possible values: dots || progress
    reporters: ['progress'],

    reportSlowerThan: 100,

    // web server port
    port: 9018,

    // cli runner port
    runnerPort: 9100,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false

  });
};