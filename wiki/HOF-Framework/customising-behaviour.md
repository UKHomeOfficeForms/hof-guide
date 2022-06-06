---
title: Customising Behaviour
path: '/HOF_Framework/customising-behaviour'
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

## GET

The request/response flow for a GET request to a form step is as follows:

```
configure ⇒ getValues ⇒ locals ⇒ render
```

## POST

The request/response flow for a POST request to a form step is as follows:

```
configure ⇒ process ⇒ validate ⇒ saveValues ⇒ successHandler
```

### configure

The configure method is used on both GET and POST requests and can be used to override the global form configuration with request/session specifc details.

The initial controller configuration - as defined in your steps file - is available on `req.form.options` and can be written to or modified with any custom step or field configuration.

### getValues

Retrieves any values required for this step. By default this is a copy of the data stored on the user's session.

This method is passed a callback as a third argument, which should be called with an error if required and the values as a second argument. Any values passed to the callback are written to `req.form.values`.

### locals

Loads any data which is required to render the page template. Any values should be returned synchronously as a set of key-value pairs.

### render

Uses Mustache to render the step html to the user. It is unlikely that you would need to modify this method unless you wish to return non-html - e.g. if rendering a PDF file.

### process

Normalises the input data from `req.body` and writes any data to `req.form.values` to be consumed by later steps.

### validate

Perform any custom validation required. By default all the fields are validated according to the rules defined in the field configuration (or custom rules defined in `configure`).

### saveValues

Saves the processed values from the form to persistent storage for later retrieval. By default this writes the values from `req.form.values` to the user's session.

### successHandler

Performs post-success actions on the form. By default this redirects the user to the subsequent form step.

## Sessions

The user's session can be accessed at any time via `req.sessionModel`, with `get`, `set`, and `unset` methods available.

## Behaviours

To add a custom behaviour to a form step, you can set a `behaviours` option on the step configuration (note that this *cannot* be done dynamically, and must be hard-coded in the step configuration).

Behaviours can either be loaded from external modules (for example [hof-behaviour-summary-page](https://github.com/UKHomeOfficeForms/hof-behaviour-summary-page) or [hof-behaviour-address-lookup](https://github.com/UKHomeOfficeForms/hof-behaviour-address-lookup)) or from files within your own codebase. The patterns are the same in each case.

The `behaviours` option can be set with either a single behaviour directly, or as an array of behaviours which are composed upon one another. If multiple behaviours are passed then they are composed onto the base controller from left-to-right, so each behaviour will have methods from the previous behaviours available as `super`.

### Writing a behaviour

The simplest form of a behaviour is a [mixin function](https://www.npmjs.com/package/mixwith#define-a-mixin), which takes a class as an argument, and extends it with custom methods.

```js
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

```js
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

```js
// reverse-a-key.js
module.exports = config => superclass => class extends superclass {
  saveValues(req, res, next) {
    req.form.values[`${config.key}-reversed`] = reverse(req.form.values[config.key]);
    super.saveValues(req, res, next);
  }
};
```

You can then apply this behaviour to a step as follows:

```js
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

### Completion behaviour

In addition to any custom behaviours, hof ships with a "complete" behaviour out of the box. Adding this behaviour to a step means that once it has been successfully submitted the user's session is marked as complete, and they cannot go back to earlier steps, only access the immediately subsequent step.

This can be set on a step by simply setting the string `'complete'` as a behaviour. It would be expected that this would normally run in conjunction with a behaviour that extends `saveValues` to submit the user's application.

```js
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
