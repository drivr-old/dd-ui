Form validations UX.
### Forms rules
 * Form save buttons should always be enabled.
 * Mark required field with red asterix.
 * Always add validation messages.
 * If user click save button show all validation errors.
 * If user click cancel hide all validation errors.
### Use show-errors directive for form groups
Apply this directive to form group and it will take care of showing and hiding errors.

### Use formValidationService for show/hide all errors
 * `showErrors(formName)`
 	:
 	Trigger to show all validations errors for all fields.
 * `hideErrors(formName)`
 	:
 	Trigger to hide all validations errors for all fields.