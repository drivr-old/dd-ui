Timepicker allow to enter custom time formats. When user have entered the value, timepicker converts model value to the 24:00 clock format. Also it's possible to use arow up/down to increase or decrease time.
### Timepicker settings ###

 * `ng-model`
 	:
 	The time string.
     
### Supported formats:  ###
 * 8a = 08:00 (If last character is a, the time is am) 
 * 8p = 20:00 (If last character is p the time is pm)
 * 815a / p = 08:15 / 20:15
 * 8.15a = 08:15 / 20:15
 * 8 = 08:00
 * 815 = 08:15
 * 125 = 01:25
 * 8.15 = 08:15
 * 8:15 = 08:15
 * 08:15 = 08:15