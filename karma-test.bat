@echo off

REM Windows script for running e2e tests
REM You have to run server and capture some browser first
REM
REM Requirements:
REM - NodeJS (http://nodejs.org/)
REM - Karma (npm install -g karma)

set BASE_DIR=%~dp0

REM if "%1" == "" goto start

:start

pushd "%BASE_DIR%"
call npm install
karma start karma.conf.js %*
popd
