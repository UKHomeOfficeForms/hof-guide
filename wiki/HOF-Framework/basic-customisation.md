---
title: Basic Form Customisation
path: '/HOF Framework/basic-form-customisation'
---
```toc
# This code block gets replaced with the Table Of Contents
```
Now we have a basic form created then the next job is to add some steps and fields to our new form.

In the directory we just created we should now find a directory `./apps/my-hof-form`. This contains the configuration and code for our app.

Its contents should look something like this:

```
apps/my-hof-form/
├── fields/
├── translations/
└── index.js
```

## Adding Steps

Open the index.js file in a text editor. You will see a steps configuration that looks like this:

```js
steps: {
  '/name': {
    fields: ['name'],
    next: '/confirm'
  },
  '/confirm': {
    behaviours: ['complete', require('hof-behaviour-summary-page')],
    next: '/complete'
  },
  '/complete': {}
}
```

This defines the steps that our form takes, and the fields which are displayed on those steps.

The keys of the `steps` object define the urls for each step.

The basic configuration options you need to add a step can be seen on the `/name` step. The `fields` option defines which fields will be displayed, and the `next` option defines the step to which the user is taken when they complete the step.

To add a new step between `/name` and `/confirm` to collect a user's address we add a child object with a key of `/address` to the steps object.

Since it is going between `/name` and `/confirm` it should have a `next` property of `/confirm`, and we should modify the `next` property of the `/name` step to `/address`.

```js
steps: {
  '/name': {
    fields: ['name'],
    next: '/address'
  },
  '/address': {
    next: '/confirm'
    },
  '/confirm': {
  ...
```

Now if you restart your server (`Ctrl+C` to stop, then run the same command again) and go back to your form in the browser you will see that when you complete the `/name` step you are taken to `/address`.

## Adding Fields

Now we need to add some fields to our new address step. This is as simple as adding the keys for those fields to the `fields` property of our new step object.

We'll add five fields to this step to collect a full address.

```js
steps: {
  ...
  '/address': {
    fields: ['address-line-1', 'address-line-2', 'town', 'country', 'postcode'],
    next: '/confirm'
  },
  ...
}
```

Returning to the app in a browser and refreshing (you will need to restart your server each time you make changes - you can have this happen automatically when running locally by running `npm run start:dev` to start your server, which is recommended when you're developing an app) you will now see these fields on the address page.

### Configuring Fields

#### Validation Rules

The next job is to configure the validation rules for our new fields. The configuration for this can be found in `./fields/index.js` in our app directory.

You will see existing configuration for the `name` field that's already in our app. We can add new config objects for each of our new fields to this.

```js
module.exports = {
  name: {
    validate: 'required'
  },
  'address-line-1': {},
  'address-line-2': {},
  town: {},
  country: {},
  postcode: {}
};
```

We want to make all of the fields except `address-line-2` mandatory, and so can give them a `validate` property of `'required'`.

```js
module.exports = {
  name: {
    validate: 'required'
  },
  'address-line-1': {
    validate: 'required'
  },
  'address-line-2': {},
  town: {
    validate: 'required'
  },
  country: {
    validate: 'required'
  },
  postcode: {
    validate: 'required'
  }
};
```

Additionally, we might want to do validation on the postcode to make sure it is correctly formatted, and so we can add an additional `postcode` validator. To add multiple validators to a field, simply set the validate property to an array.

```js
postcode: {
  validate: ['required', 'postcode']
}
```

* [full list of built-in validation types](https://github.com/UKHomeOfficeForms/hof-form-controller/blob/master/lib/validation/validators.js)

#### Field Types

By default all fields are `input[type=text]` unless otherwise specified. In this case, we possibly want our country field to be a `select` element instead.

To do this we add a `mixin` property of `select` to that field.

```js
country: {
  mixin: 'select',
  validate: 'required'
}
```

We also need to add some options for the field. Fortunately there is a Home Office managed list of countries, so we don't need to handle this ourselves. Install `hof-util-countries` from npm, and then add the following:

```js
country: {
  mixin: 'select',
  options: require('hof-util-countries')(),
  validate: 'required'
}
```

For more `mixin` options and field configuration settings see [hof-template-mixins](https://npmjs.com/hof-template-mixins).

#### Formatter

Some text inputs will include characters you don't wish to be recorded (e.g. hyphens or spaces). To remove these with the `formatter field`.

```js
sortCode: {
  mixin: 'textarea'
  validate: 'required',
  formatter: ['removehyphens']
}
```

You can also use the formatter field to ensure the characters recorded are all in upper or lower case.

```js
brpNumber: {
  mixin: 'textarea'
  validate: 'required',
  formatter: ['uppercase']
}
```

For other `formatting` options see [hof-controller-formatters](https://github.com/UKHomeOfficeForms/hof-form-controller/blob/master/lib/formatting/formatters.js)

#### Field Labels

The last thing to do is to add some label content for our new fields. You will see that right now they appear with default labels like `fields.address-line-1.label`.

To add label content for our new fields we need to set some properties in `./translations/src/en/fields.json`. You will see here that there is a label defined for the name field. We can add some more labels for our new fields as follows:

```json
{
  "name": {
    "label": "Name"
  },
  "address-line-1": {
    "label": "Address"
  },
  "address-line-2": {
    "label": "Address line 2"
  },
  "town": {
    "label": "Town"
  },
  "country": {
    "label": "Country"
  },
  "postcode": {
    "label": "Postcode"
  }
}
```

Returning to your app in a browser you will now see that the new address fields now use the labels we defined for them.

> [more information about how the content for fields can be configured](#fields)
