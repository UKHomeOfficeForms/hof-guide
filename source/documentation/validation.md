# Validation Rules

HOF comes with a number of validators built in as standard.

## Using built-in validators

To add a validator to a field, you add it to a `validate` array on the field configuration.

In most cases it is sufficient to simply add the name of the validator as a string. For example, to make an email field mandatory, and check the email address is correctly formatted:

```js
{
  email: {
    validate: ['required', 'email']
  }
}
```

Some validators require additional arguments, which can be specified as follows:

```js
{
  name: {
    validate: [
      { type: 'maxlength', arguments: 10 }
    ]
  },
  referencenumber: {
    validate: [
      { type: 'regex', arguments: /^[a-z0-9]{9}$/i }
    ]
  }
}
```

Here the validator name is passed as a `type` property, and any arguments as an `arguments` property.

> Note: in the second example above - using regex validation - the regex is equivalent to applying an `exactlength` and an `alphanum` validator. In this case it might be preferable to use these two separate validators in order to be able to provide users with more fine-grained error messages.

## Validator Types

### required

### regex

### equal

### url

### email

### postcode

### minlength

### maxlength

### exactlength

### alphanum

### numeric

### phonenumber

### ukmobilephone

### date

### before

### after

> Note: all validators except `required` will allow an empty input to be valid. If an empty input is not valid then a `required` validator must be applied.

## Custom Validators

In addition to the built-in validators, you can also define a custom validator as a named function. The function will be passed the field value as a single argument, and should return true for valid input, and false for invalid input.

```js
{
  'credit-card-number': {
    validate: [
      function luhn (number) {
        // perform a credit card luhn check
        // https://en.wikipedia.org/wiki/Luhn_algorithm
        return hasValidLuhn(number);
      }
    ]
  }
}
```

If validation fails for a custom validator, then the name of the function is used to [lookup the validation message](#validation-messaging).
