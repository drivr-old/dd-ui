dd-ui Datepicker allows to enter custom date formats and use original bootstrap datepicker.

### dd-ui Datepicker Settings ###

 * `ng-model`
 	:
 	The date object.
     
 * `date-format`
 	:
 	Date format string. In .Net it can be taken from CultureInfo.CurrentCulture.DateTimeFormat.ShortDatePattern
     
 * `show-day-name`
 	_(Default: false)_ ::
 	Show day name.
     
 * `ng-change`
 	:
 	Can be used together with `ng-model` to call a function whenever the datetime changes.

 * `date-disabled (date, mode)`
 	_(Default: null)_ :
 	An optional expression to disable visible options based on passing date and current mode _(day|month|year)_.

 * `template-url`
  _(Default: 'template/dd-datepicker/dd-datepicker.html') :
  Allows overriding of default template of the datepicker
  
  
### dd-ui Datepicker supports custom users date input depending on given date format ###
* 2108 OR 0821 = 21.08 (21st of August)
* 21-08 OR 08-21 = 21.08 (21st of August)
* 21/08 OR 08/21 = 21.08 (21st of August)
* 21 08 OR 08 21 = 21.08 (21st of August)
 