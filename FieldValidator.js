/*!
 * FieldValidator.js 0.0.1
 *
 * Copyright 2019, Borislav Madzharov
 * Licensed under the MIT license
 *
 * 	https://github.com/b0rizzz/field-validator
 */

var FieldValidator = function() {

	var validatorMessages = {
		required: 'The #fieldLabel# is required!',
		natural: 'The #fieldLabel# must be a natural integer!',
		naturalPositive: 'The #fieldLabel# must be a positive integer!',
		numeric: 'The #fieldLabel# must be a number!',
		minNumber: 'The #fieldLabel# must be minimum #fieldSize#!',
		maxNumber: 'The #fieldLabel# must be maximum #fieldSize#!',
		str: 'The #fieldLabel# must be a string!',
		minLength: 'The #fieldLabel# must be at least #fieldSize# characters!',
		maxLength: 'The #fieldLabel# must be maximum #fieldSize# characters!',
		validEmail: 'The #fieldLabel# must be a valid email!',
	};

	function Validator(extendedErrors) {
		var self = this;
		
		self.extendedErrors = extendedErrors;
	
		if (typeof new.target === "undefined") {
			throw new Error("Constructor must be called with new.");
		}
	
		function isNumeric(obj) {
			return !isNaN(parseFloat(obj)) && isFinite(obj);
		}
		
		function processError(error, label, message, size) {
			var errorMessage = message || validatorMessages[error];
			
			if (extendedErrors) { 
				
				return { error: error, field: label, message: errorMessage.replace('#fieldLabel#', label).replace('#fieldSize#', size) };
			} else {
			
				return errorMessage.replace('#fieldLabel#', label).replace('#fieldSize#', size);
			}
		}
	
		self.required = function (value, label, message) {
		
			if (!value) { 
			
				return processError('required', label, message);
			}
		};
		
		self.natural = function (value, label, message) {
			
			if (value) { 
				if (isNaN(parseInt(value, 10)) || value < 0) {
					
					return processError('natural', label, message);
				}  
			}
		};
		
		self.naturalPositive = function (value, label, message) {
			
			if (value) {
				if (isNaN(parseInt(value, 10)) || value < 1) {
				
					return processError('naturalPositive', label, message);
				} 
			} 
		};
	
		self.numeric = function (value, label, message) {
		
			if (value && !isNumeric(value) ) { 
			
				return processError('numeric', label, message); 
			}
		};
	
		self.minNumber = function (value, scale, label, message) {
		
			if (value && value < scale) { 
			
				return processError('minNumber', label, message, scale);
			}
		};
	
		self.maxNumber = function (value, scale, label, message) {
		
			if (value && value > scale) { 
					
				return processError('maxNumber', label, message, scale); 
			}
		};
	
		self.str = function (value, label, message) {
		
			if (value && typeof value !== 'string') { 
			
				return processError('str', label, message); 
			}
		};
	
		self.minLength = function (value, length, label, message) {
		
			if (value && value.length < length) { 
			
				return processError('minLength', label, message, length);
			}
		};
	
		self.maxLength = function (value, length, label, message) {
		
			if (value && value.length > length) { 
			
				return processError('maxLength', label, message, length); 
			}
		};
		
		self.validEmail = function (value, label, message) {		
			var re = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');
	
			if (value && !re.test(value)) {
			
				return processError('validEmail', label, message);
			}	
		};
	
		self.make = function (resource) {
			var request = resource.data,
				rules = resource.rules,
				messages = resource.hasOwnProperty('messages') ? resource.messages : {},
				labels = resource.hasOwnProperty('labels') ? resource.labels :  {},
				errors = [],
				re = new RegExp(':');
	
			Object.keys(rules).forEach(function (key) {
				rules[key].split('|').forEach(function (func) {
					var label = labels[key] || key;
				
					if (re.test(func)) {
						var f = func.split(':');
						errors.push( self[f[0]](request[key], f[1], label, messages[f[0]]) );
					} else {
						errors.push( self[func](request[key], label, messages[func]) );
					}
				});
			});
	
			return errors.filter(function (i) { return i !== undefined; });
		};
	}

	function getData(options) {
		var data = {};

		if (options.form) {

			var form = new FormData( document.querySelector(options.form) );

			form.forEach(function(value, key) {
				data[key] = value;
			});

		} else {

			Object.keys(options.selectors).forEach(function(key) {
				data[key] = document.querySelector(options.selectors[key]).value;
			});

		}

		return data;
	}

	function alertBox(content, className) {
		var alertContainer = document.createElement('div');
		var closeBtn = document.createElement('span');

		alertContainer.style = 'margin: 5px; padding: 20px; background-color: #f44336; color: black; position: relative;';
		alertContainer.className = className;
		alertContainer.appendChild(content);

		closeBtn.style = 'color: black; font-weight: bold; font-size: 22px; cursor: pointer; transition: 0.3s; position: absolute; top:5px; right: 10px;';
		closeBtn.innerHTML = '&times;';
		closeBtn.onclick = function() {
			this.parentElement.remove();
		};

		alertContainer.appendChild(closeBtn);

		return alertContainer;
	}
	
	function insertAfter(newNode, referenceNode) {
    	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}
	
	function validate(resource) {
		var errors = resource.hasOwnProperty('errors') && resource.errors === 'extended' ? resource.errors : null;
		var validator = new Validator(errors);
		
		if (resource.callbacks) {
			Object.keys(resource.callbacks).forEach(function(key) {
				validator[key] = resource.callbacks[key];
			});
		}
    	
		var validationErrors = validator.make(resource); 
			
		
		function appendErrors(options) {
			 var extendedWrapperStyle = options.extendedWrapperStyle || 'color: red; font-weight: bold;',
			 	 ul = document.createElement('ul'),
				 fragment = document.createDocumentFragment()
				 alertBoxClassName = options.listClassName || '';
			 
			 
			 
			if (validationErrors) {
			
				if (options.listWrapper) {
				
					if (errors) {

						Object.keys(validationErrors).forEach(function(key) {
							var li = document.createElement('li');
    						li.textContent = validationErrors[key]['message'];
    						fragment.appendChild(li);
						});

					} else {

						validationErrors.forEach(function(msg) {
							var li = document.createElement('li');
    						li.textContent = msg;
    						fragment.appendChild(li);
						});

					}
					
					ul.appendChild(fragment);
					var ab = alertBox(ul, alertBoxClassName),
						pWrapper = document.querySelector(options.listWrapper);

					pWrapper.insertBefore(ab, pWrapper.firstChild);

				} else {
			
					if (errors) { 
					
						var form = options.form ? document.querySelector(options.form) : document;
							
						Object.keys(validationErrors).forEach(function(key) {
							var wrapper = options.extendedWrapper ? document.createElement(options.extendedWrapper) : document.createElement('div');
							wrapper.style = extendedWrapperStyle;
							wrapper.innerHTML = validationErrors[key]['message'];
							var selector = options.selectors ? options.selectors[ validationErrors[key]['field'] ] : '[name=' + validationErrors[key]['field'] + ']';
					
							insertAfter( wrapper, form.querySelector(selector) );
						});
						
					} else {

						throw 'Missing errors property in method validate!';
					}
					
				}	
			}
		}
		
    	return { errors: validationErrors, appendErrors: appendErrors }
	}
	
	return { validate: validate, getData: getData };
	
}();
