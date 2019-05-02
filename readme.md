A simple JS module for validating fields provided in a data object structure.

### `validate`

```js
var v = FieldValidator.validate({
    //required
	data:{
		name: "John",
		email: "john_snow@got.com",
		status: 0,
		is_admin: 0,
		points: 133.5,
	},
	//required
	rules:{
		name: "required|str|minLength:5|maxLength:55",
		email: "validEmail",
		status: "naturalPositive|minNumber:1|maxNumber:5",
		is_admin: "natural|myCustomRule",
		points: "numeric|myCustomRuleTwo:10"
	},
	//optional
	//the provided label name will appear instead of the #fieldLabel#
	//which by default is the property name in the data object
	labels:{
		name: "Name",
		email: "Email",
		status: "Status",
		is_admin: "Admin",
		points: "Points",
	},
	//optional
	//these are the default messages of the module
	//if you want you can add yours
	messages:{
		maxLength: "The #fieldLabel# must be maximum #fieldSize# characters!",
		maxNumber: "The #fieldLabel# must be maximum #fieldSize#!",
		maxYear: "The #fieldLabel# must be maximum #fieldSize#!",
		minLength: "The #fieldLabel# must be at least #fieldSize# characters!",
		minNumber: "The #fieldLabel# must be minimum #fieldSize#!",
		minYear: "The #fieldLabel# must be minimum #fieldSize#!",
		natural: "The #fieldLabel# must be a natural integer!",
		naturalPositive: "The #fieldLabel# must be a positive integer!",
		numeric: "The #fieldLabel# must be a number!",
		required: "The #fieldLabel# field is required!",
		str: "The #fieldLabel# must be a string!",
		validEmail: "The #fieldLabel# must be a valid email!",
	},
	//optional
	//with this option the validate method will return an array of simple data objects
	errors: 'extended',
	//optional
	//you can add your custom rule
	callbacks: {
		myCustomRule: function(value, label) {
			var message = 'custom message!';

			if (!value) {

				return message;
			}
		},
		myCustomRuleTwo: function(value, length, label, message) {
			return someFunction(value, length, label, message);
		},
		callbackThree: someFunction,
	}
  });

  console.log(v.errors);

/* 
[
    {error: "naturalPositive", field: "status", message: "The Status must be a positive integer!"},
    {error: "minLength", field: "name", message: "The Name must be at least 5 characters!"}
]
*/

//if you miss 'errors: extended' option the output will be

/*
    ["The Status must be a positive integer!", "The Name must be at least 5 characters!"]
*/

```

### `appendErrors`

```js
FieldValidator
	.validate({...})
	.appendErrors({
		//append alert box with errors as a list
		listWrapper: '#v-form', //wrapper where the alert box will display
		//optional
		listClassName: '', //listWrapper class name
	});

```
![alt text](https://github.com/b0rizzz/field-validator/blob/master/img/list-with-errors.png)

```js
	FieldValidator
		.validate({
			...
			errors: 'extended',
		})
		.appendErrors({
			//append error after the field
			//the options below depends on 'errors: extended' property in the validate method

			form: '#v-form', //this will looking for a field with the same name as the provided property name at the data object in validate method
			//or
			selectors: {
				name: '#user_name',
				email: '#user_mail',
			},

			extendedWrapperStyle: 'color:red;',
			extendedWrapper : 'div',
		});

```

![alt text](https://github.com/b0rizzz/field-validator/blob/master/img/extended-errors.png)

### `getData`

If you want `FieldValidator.getData()` can collect all the data for you in the required of the validator format

```js
var data = FieldValidator.getData({
	form: '#v-form',//this will get the FormData and convert it to the required format
	//or
	//you can use separate querySelectors for every field
	selectors: {
		name: '[name=name]',
		email: '[name=email]',
	},
});

```

## TODO

- validate Date field

## Something Missing?

If you have ideas please let me know or contribute some, just go ahead