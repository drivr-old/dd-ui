<a name="0.3.7"></a>
## [0.3.7](//compare/0.3.6...v0.3.7) (2016-03-14)




<a name="0.3.6"></a>
## [0.3.6](//compare/0.3.5...v0.3.6) (2016-03-09)


### Bug Fixes

* **lookup:** Allow override of limit parameter. b00611d



<a name="0.3.5"></a>
## [0.3.5](//compare/0.4.0...v0.3.5) (2016-03-06)




<a name="0.4.0"></a>
# [0.4.0](//compare/0.3.4...v0.4.0) (2016-03-06)


### Bug Fixes

* **datetimepicker:** add modules dep for unit test 6c2e784
* **datetimepicker:** change replace type to bool 7700414
* **datetimepicker:** remove uneeded watches and timeouts 73a3293
* **docs:** toogle menu 271de7b

### Features

* **datetimepicker:** html and css cleanup 3a4f0c7



<a name="0.3.4"></a>
## [0.3.4](//compare/0.3.3...v0.3.4) (2016-03-03)


### Bug Fixes

* **datetimepicker:** check if time is changed 9ff3cec
* **datetimepicker:** fix es lint 2a2ea9b



<a name="0.3.3"></a>
## [0.3.3](//compare/0.3.2...v0.3.3) (2016-03-01)


### Bug Fixes

* **datetimepicker:** 23:59->00:01=+1 day and 00:01->23:59=-1 day b2bd04c
* **datetimepicker:** add time to Date object 778428f
* **timepicker:** handle 12a/12p time parsing 4623edf

### Features

* **timepicker:** add unit test for date conversion check a13a8e7



<a name="0.3.2"></a>
## [0.3.2](//compare/0.3.1...v0.3.2) (2016-02-25)


### Bug Fixes

* **datepicker:** remove unneeded watches 9f209e7
* **datepicker:** set day label with important 928723b
* **datepicker:** set input on focus after calendar is closed 8a15016
* **datepicker:** use arrow keys to add/substract date 2db4240
* **datetimepicker:** adjust date forward if current date ebc880a
* **datetimepicker:** fix es lint 7f39202
* **datetimepicker:** init values from ngWatch 8027068
* **datetimepicker:** parse user input on blur 460b56d
* **datetimepicker:** remove unused param ad3be57
* **datetimepicker:** set seconds and miliseconds to 0 for currentTime a79c5c8
* **timepicker:** check if value is changed f886768

### Features

* **datepicker:** allow add date by arrow keys ff4a718



<a name="0.3.1"></a>
## [0.3.1](//compare/0.3.0...v0.3.1) (2016-02-22)


### Bug Fixes

* **datetimepicker:** if date is cleared do not change time 6c75723

### Features

* **bootstrap:** revert update ui-bootstrap to latests version 84f6c00
* **bootstrap:** update ui-bootstrap to latests version 52ca9ea
* **uibootstrap:** update ui-bootstrap-tpls to latest 8ddf28c



<a name="0.3.0"></a>
# [0.3.0](//compare/0.2.9...v0.3.0) (2016-02-18)


### Bug Fixes

* **datepicker:** update day name label eef6eb3
* **datetimepicker:** if ngModel changes rerun internal logic 5c7dc56
* **datetimepicker:** rename to allow-forward-date-adjustment 730d7f2
* **timepicker:** remove uneeded code 11c641d

### Features

* **datetimepicker:** added scope.allowAdjustDate property and logic e78b60e
* **datetimepicker:** update docs for datetimepicker ab87afe



<a name="0.2.9"></a>
## [0.2.9](//compare/0.2.9...v0.2.9) (2016-02-18)


### Bug Fixes

* **datepicker:** update day name label eef6eb3
* **datetimepicker:** if ngModel changes rerun internal logic 5c7dc56
* **datetimepicker:** rename to allow-forward-date-adjustment 730d7f2
* **timepicker:** remove uneeded code 11c641d

### Features

* **datetimepicker:** added scope.allowAdjustDate property and logic e78b60e
* **datetimepicker:** update docs for datetimepicker ab87afe



<a name="0.2.9"></a>
## [0.2.9](//compare/0.2.8...v0.2.9) (2016-02-17)


### Features

* **datetimepicker:** move week day label to dd-datepicker ec520cc
* **datetimepicker:** update docs 8505e39
* **fix:** add important to datepicker width e066093
* **fix:** added ngRequired support for dd-datetimepicker 7293f4e
* **fix:** eslint fixes 9398d17
* **fix:** fix eslint warnings and unit tests 768d3f4
* **fix:** load css files for karma 4bda704
* **fix:** sync dd-datepicker after dd-datetimepicker time change 63684ec
* **fix:** update docs 4ecd216
* **fix:** update package.json 8692d14
* **fix:** update travis compiler b11270c
* **fix:** validate custom user date using dateDisabled 54589fb
* **fix:** wrap to iife c2bafe4
* **grunt:** move css to separate files d6bab2f
* **grunt:** update grunt tasks 2029a78



# 0.2.8 (2016-02-12)

## Features

- **fix:** 
  - change back to white color ([e40c05fc](http://github.com/clickataxi/dd-ui/commit/e40c05fc))  
  - fix invalid demo html markup ([a3513c3a](http://github.com/clickataxi/dd-ui/commit/a3513c3a))  
  - change to white color ([e9624845](http://github.com/clickataxi/dd-ui/commit/e9624845))   


# 0.2.7 (2016-02-12)

## Features

- **busyelement:** 
  - bug fix ([44be2056](http://github.com/clickataxi/dd-ui/commit/44be2056))  
- **datetimepicker:** 
  - change date and show green bg ([9c5b003c](http://github.com/clickataxi/dd-ui/commit/9c5b003c))   

## Bug Fixes

- **datetimepicker:** 
  - add semicolon ([eb1b5e0d](http://github.com/clickataxi/dd-ui/commit/eb1b5e0d))  
- **timepicker:** 
  - add default value if not exsist ([54ac6a54](http://github.com/clickataxi/dd-ui/commit/54ac6a54))   

# 0.1.0 (2014-08-28)

_Very first, initial release_.

## Features

Version `0.1.0` was released with the following directives:

* validation-email