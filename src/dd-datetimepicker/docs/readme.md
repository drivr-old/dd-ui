Combined dd-timepicker and dd-datepicker that uses a single Date model.

### Datetimepicker Settings ###

 * `ng-model`
 	:
 	The date object.

 * `date-format`:
    String. Example: yyyy-MM-dd. See dd-datepicker for more information.

 * `ng-required`
 	:
 	Set as required field.
     
 * `allow-forward-date-adjustment`
 	_(Default: false)_ :
 	If true and user enter time less than current time jump to next day.
     
 * `show-day-name`
 	_(Default: false)_ :
 	Show day name.
     
 * `ng-change`
 	:
 	Can be used together with `ng-model` to call a function whenever the datetime changes.

 * `date-disabled (date, mode)`
 	_(Default: null)_ :
 	An optional expression to disable visible options based on passing date and current mode _(day|month|year)_.

 * `template-url`
  _(Default: 'template/datetimepicker/datetimepicker.html') :
  Allows overriding of default template of the datetimepicker
 
 * `minute-step`
 	_(Defaults: 1)_ :
 	 Number of minutes to increase or decrease when using a timepicker.
 * `date-placeholder`
 	Set date placeholder
	 
 * `time-placeholder`
 	Set time placeholder

 * `popup-placement`
    _(Default: 'bottom-left') :
    Calendar popup placement