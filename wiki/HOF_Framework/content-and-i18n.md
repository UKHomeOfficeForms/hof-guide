---
title: Content and i18n
---
```toc
# This code block gets replaced with the Table Of Contents
```
hof comes with multi-language support out-of-the-box.

It uses a translation library to load content from a set of language specific json files to display in your app.

## Default application content

If you have used the `hof-generator` to initialise your application you will see a translations directory at `./apps/my-hof-app/translations` with something like the following file structure:

```
apps/my-hof-form/translations
└─┬ src/
  └─┬ en/
    ├── fields.json
    ├── journey.json
    └── pages.json
```

These json files contain the translated content for the following application features.

### journey

This contains the application-wide content that applies to all pages in your application. In most cases this is only the application title as shown in the header bar.

### pages

This contains page-specific content for each page of your app. The top level keys in `pages.json` correspond to the routes onto which your steps are mounted, as defined in your application config.

For example, to add the content for the address step we created earlier at `/address` then you would add the following to your `pages.json`:

```json:title=pages.json
{
  "name": {
    "header": "Personal details",
  },
  "address": {
    "header": "Address details"
  }
}
```

The key for each section of the `pages.json` file should match the url path of the step.

By default a `header` and optional `intro` are loaded for each page. If you are using a custom template for a page then you might wish to define further page-level translations here.

### fields

This contains the content for each field, with the keys as per the field names in your fields configuration.

The properties available for each field vary slightly according to the field type, but the following are standard:

* `label` - defines the label element text for text inputs and select boxes
* `legend` - defines the legend text for radio and checkbox groups
* `hint` - provides an optional help message
* `options` - defines the options available for select elements and radio and checkbox groups

#### options

The `options` translation for a radio/checkbox group or select element should consist of a label for each option as defined in the options for the field. For example, for a yes/no radio button group:

```json:title=fields.json
{
  "resident-in-uk": {
    "legend": "Are you permanently resident in the United Kingdom?",
    "options": {
      "yes": {
        "label": "Yes"
      },
      "no": {
        "label": "No"
      }
    }
  }
}
```

#### Validation messaging

The validation messages applicable to a field can also be defined as part of the field's translation by defining a `validation` object as part of the field's translation. For example - for an email input:

```json:title=validation.json
{
  "email-address": {
    "label": "Email address",
    "validation": {
      "required": "Please enter an email address",
      "email": "Please enter a valid email address containing an '@' symbol"
    }
  }
}
```

This will then display the appropriate error message depending on the [validation type](https://github.com/UKHomeOfficeForms/hof-form-controller/blob/master/lib/validation/validators.js) which has failed.

Depending on the type of validator which has failed, certain variables are available for use in messages.

* `maxlength`/`minlength`/`exactlength` - expose the value of the length parameter as a variable with the same name - e.g. `"Please enter at least {{minlength}} characters"`
* `before`/`after` - expose a `diff` property, which contains a stringified version of the limit - e.g. `'5 years'`, `'3 months'`

If you wish to define global fallback messages for particular validation types then you can create a `validation.json` which will be used if no field-specific messages are present.

```json:title=validation.json
{
  "required": "This field is required",
  "minlength": "Enter at least {{minlength}} characters"
}
```

## Free text content

In cases where the content is more complex than simple strings, then free text content can be loaded in markdown format by using the `markdown` mixin in your page templates.

In your application's `views` directory, create the following folder structure:

```
apps/my-hof-form/views
└─┬ content/
  └─┬ en/
    └── free-text-content.md
```

In your page template you can then include `{{#markdown}}free-text-content{{/markdown}}` and the rendered markdown content of that file will be included in your page.

## Adding languages

Adding support for a second language is then simply a case of duplcating your json and markdown files from an `en` directory into directories corresponding to the language code of the language you wish to add.

So to add Welsh language support you would copy the `en` directory to a `cy` directory resulting in the following file structure:

```
apps/my-hof-form/translations
└─┬ src/
  ├─┬ en/
  │ ├── fields.json
  │ ├── journey.json
  │ └── pages.json
  └─┬ cy/
    ├── fields.json
    ├── journey.json
    └── pages.json
```

And correspondingly for any markdown content:

```
apps/my-hof-form/views
└─┬ content/
  ├─┬ en/
  │ └── free-text-content.md
  └─┬ cy/
    └── free-text-content.md
```

Your hof app will then detect the language the user has requested from the `Accept-language` headers on their request and serve the appropriate content.
