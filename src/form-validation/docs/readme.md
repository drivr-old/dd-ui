Form validations UX.
### Forms rules
 * Form save buttons should always be enabled.
 * Mark required field with red asterix.
 * Always add validation messages.
 * If user click save button show all validation errors.
 * If user click cancel hide all validation errors.

### Use ufe show-errors directive
Apply this directive to form group or any div with input inside and it will take care of showing and hiding error messages.
* `custom`
 	:
 	Set `custom="true"` if you want to handle custom errors show/hide logic.
* `show-errors`
 	:
 	If custom="true" this can be used to manually toggle errors. Ex. 

```html
<div show-errors="{{"{{myCustomCondition}\}"}}"></div>
```

### Use formValidationService for show/hide all errors
 * `showErrors(formName)`
 	:
 	Trigger to show all validations errors for all fields.
 * `hideErrors(formName)`
 	:
 	Trigger to hide all validations errors for all fields.