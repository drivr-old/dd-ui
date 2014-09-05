In cell edit status visualizer. When something is changed in cell and immediate save to server is required, it would be nice to give feedback for user when request is in progress and when data are updated or update is failed. For this purpose we have created busy-element directive. It covers parent element with overlay and shows spinner while busy. After request is done, it blinks in green or in red depending on update status.

NOTE: If you want to have "blinking" animated, you must to add "angular-animate.js" to your page and add "ngAnimate" module dependency to your application, like:
```javascript
angular.module('dd.ui.demo', ['dd.ui', 'ngAnimate']);
```