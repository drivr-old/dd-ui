# dd-ui - [AngularJS](http://angularjs.org/) directives that we use every day
***
[![Build Status](https://secure.travis-ci.org/clickataxi/dd-ui.png)](http://travis-ci.org/clickataxi/dd-ui)

## Demo

Do you want to see directives in action? Visit http://clickataxi.github.io/dd-ui/!

## Installation
 `jspm install dd-ui=github:clickataxi/dd-ui`

```javascript
import 'dd-ui';
// ...
angular.module('myModule', ['dd.ui']);
```
## Release
* After your PR is merged switch to master and pull latests changes
* Bump up package.json version and <b>jspm main file version</b> in `package.json`. If you don't understand this please see previous release commits and look at package.json changes.
* Open command line and run `grunt release-start`
* Verify changes are correct and run `grunt release-push`
* Run `grunt gh-pages` to update demo site

### Development
#### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install global dev dependencies: `npm install -g grunt-cli karma gulp typescript`
* Install local dev dependencies: `npm install` while current directory is dd-ui repo

#### Build
* Run `gulp` to clean, tslint and compile files

#### Build and watch Typescript files
* If you are using VSCODE which is recommended simply press `ctrl`+`shift`+`b` and all src files will be compiled in watch mode.
* You can also run cmd command `tsc -w` from root dd-ui directory.

#### Tests
* Run `karma-test.bat` to run tests



#### Demo page
* Run `grunt-server.bat` to serve demo page


