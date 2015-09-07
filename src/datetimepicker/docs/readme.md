Combined UI Bootstrap Timepicker and Datepicker that uses a single Date model.

### Datetimepicker Settings ###

 * `ng-model`
 	:
 	The date object.

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
 	 Number of minutes to increase or decrease when using a button.

 * `show-meridian`
 	_(Defaults: true)_ :
 	Whether to display 12H or 24H mode.

 * `show-spinners`
    _(Defaults: true)_ :
     Shows spinner arrows above and below the inputs