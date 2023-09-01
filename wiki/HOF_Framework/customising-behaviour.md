---
title: Customising Behaviour
---
```toc
# This code block gets replaced with the Table Of Contents
```
You will also see in your configuration that the `/confirm` step has an additional `behaviours` option. This defines some custom functionality for that step.

"Behaviours" are used to extend the default request pipeline from the [core form controller](https://github.com/ukhomeofficeforms/hof-form-controller) with custom functionality for you app.

Before writing your own behaviours it is helpful to understand the request/response flow, and what the different methods are used for.

## The request pipeline

The underlying controller that handles the form GET/POST pipeline consists of a number of stages for form rendering and processing/validation that can be extended to perform advanced custom behaviour for your forms.

All of the pipeline methods are passed the request and response objects as arguments. Unless specified below, methods are also passed a callback as a third argument, which should be called with an `Error` if applicable.

### GET Request Flow

| Type          | Step          | Description                                       | Example                                                                                       |
|---------------|---------------|---------------------------------------------------|-----------------------------------------------------------------------------------------------|
| GET           | configure      | Override global form configuration with request/session-specific details. Initial controller configuration available on `req.form.options`. | N/A |
| GET           | getValues      | Retrieves any values required for this step. By default, this is a copy of the data stored on the user's session. This method is passed a callback as a third argument, which should be called with an error if required and the values as a second argument. Any values passed to the callback are written to `req.form.values`. | Example: ```js getValues(req, res, (err, values) => { if (err) throw err; req.form.values = values; }) ``` |
| GET           | locals         | Loads any data required for rendering the page template as key-value pairs synchronously. | N/A |
| GET           | render         | Uses Mustache to render the step HTML to the user. Unlikely to need modification unless returning non-HTML. | N/A |

### POST Request Flow

| Type          | Step          | Description                                       | Example                                                                                       |
|---------------|---------------|---------------------------------------------------|-----------------------------------------------------------------------------------------------|
| POST          | configure      | Override global form configuration with request/session-specific details. Initial controller configuration available on `req.form.options`. | Example: ```js configure(req, res) { req.form.options.title = 'Custom Title'; } ``` |
| POST          | process        | Normalizes the input data from `req.body` and writes any data to `req.form.values` to be consumed by later steps. | N/A |
| POST          | validate       | Perform any custom validation required. By default, all the fields are validated according to the rules defined in the field configuration (or custom rules defined in `configure`). | Example: ```js validate(req, res) { if (req.form.values.age < 18) return 'Age must be 18 or older'; } ``` |
| POST          | saveValues     | Saves the processed values from the form to persistent storage for later retrieval. By default, this writes the values from `req.form.values` to the user's session. | N/A |
| POST          | successHandler | Performs post-success actions on the form. By default, this redirects the user to the subsequent form step. | N/A |

### Sessions

| Type          | Action        | Description                                       | Example                                                                                       |
|---------------|---------------|---------------------------------------------------|-----------------------------------------------------------------------------------------------|
| N/A           | Access        | The user's session can be accessed at any time via `req.sessionModel`. | Example: ```js const sessionData = req.sessionModel.get('userData'); ``` |
| N/A           | Methods       | Methods available: `get`, `set`, and `unset`.    | Example: ```js req.sessionModel.set('isLoggedIn', true); ``` |

### Behaviours

| Type          | Action        | Description                                       | Example                                                                                       |
|---------------|---------------|---------------------------------------------------|-----------------------------------------------------------------------------------------------|
| N/A           | Configuration | To add a custom behavior to a form step, you can set a `behaviours` option on the step configuration (note that this *cannot* be done dynamically, and must be hard-coded in the step configuration). | N/A |
| N/A           | Loading       | Behaviours can either be loaded from external modules (for example [hof-behaviour-summary-page](https://github.com/UKHomeOfficeForms/hof-behaviour-summary-page) or [hof-behaviour-address-lookup](https://github.com/UKHomeOfficeForms/hof-behaviour-address-lookup)) or from files within your own codebase. The patterns are the same in each case. | N/A |
| N/A           | Composition   | The `behaviours` option can be set with either a single behavior directly, or as an array of behaviours which are composed upon one another. If multiple behaviours are passed then they are composed onto the base controller from left-to-right, so each behaviour will have methods from the previous behaviours available as `super`. | N/A |


### Writing a behaviour

The simplest form of a behaviour is a [mixin function](https://www.npmjs.com/package/mixwith#define-a-mixin), which takes a class as an argument, and extends it with custom methods.

```js:title=example-configure-behaviour.js
// my-behaviour.js
module.exports = superclass => class extends superclass {
  configure(req, res, next) {
    super.configure(req, res, err => {
      // do some custom configuration here
      next(err);
    });
  }
};
```

You can then apply this behaviour to a step as follows:

```js:title=behaviour-in-steps.js
module.exports = {
  steps: {
    '/my-step': {
      behaviours: require('./my-behaviour')
    }
  }
};
```

### Configurable behaviours

In most cases, we will want custom behaviours to be configurable - for example, the [emailer behaviour](https://github.com/UKHomeOfficeForms/hof-behaviour-emailer) - so the same behaviour can be re-used with different options.

In this case we can define our behaviour as a function which receives configuration options and returns a mixin function.

```js:title=example-saveValues.js
// reverse-a-key.js
module.exports = config => superclass => class extends superclass {
  saveValues(req, res, next) {
    req.form.values[`${config.key}-reversed`] = reverse(req.form.values[config.key]);
    super.saveValues(req, res, next);
  }
};
```

You can then apply this behaviour to a step as follows:

```js:title=behaviour-in-step.js
const reverse = require('./reverse-a-key');

module.exports = {
  steps: {
    '/my-step': {
      fields: ['name'],
      behaviours: reverse({ key: 'name' })
    }
  }
};
```
### Validation behaviour
We can configure custom validations as a behaviour using the ```validate``` method:
```js:title=validation-behaviour.js
module.exports = SuperClass => class extends SuperClass {
  validate(req, res, next) {
    if (req.form.values.email.toLowerCase() !== req.form.values.emailVerify.toLowerCase()) {
      return next({
        emailVerify: new this.ValidationError(
          'emailVerify',
          {
            type: 'notSame'
          }
        ),
        email: new this.ValidationError(
          'email',
          {
            type: 'notSame'
          }
        )
      });
    } super.validate(req, res, next);
    return next;
  }
};
```
The behaviour is applied to a step:
```js:title=behaviour-in-step.js
module.exports = {
  steps: {
    '/email': {
      behaviours: [VerifyEmail],
      fields: ['email', 'emailVerify'],
    }
  }
};
```

The validation message is then set against the configured type in translations/validation.json:
```json:title=validation.json
"email": {
  "notSame": "Your email addresses do not match"
}
```

### Completion behaviour

In addition to any custom behaviours, hof ships with a "complete" behaviour out of the box. Adding this behaviour to a step means that once it has been successfully submitted the user's session is marked as complete, and they cannot go back to earlier steps, only access the immediately subsequent step.

This can be set on a step by simply setting the string `'complete'` as a behaviour. It would be expected that this would normally run in conjunction with a behaviour that extends `saveValues` to submit the user's application.

```js:title=framework-and-custom-behaviours.js
const submit = require('./my-submission-behaviour');

module.exports = {
  steps: {
    '/declaration': {
      behaviours: ['complete', submit],
      next: '/confirmation'
    },
    '/confirmation': {
      // only this step can be accessed once "declaration" step is submitted
    }
  }
};
```
