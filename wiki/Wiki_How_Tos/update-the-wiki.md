---
title: Update The Wiki
---
To renew the HOF Guide site itself with the latest Gov UK Javascript & Styling.<br></br>

Use the <Link to="https://x-govuk.github.io/govuk-eleventy-plugin/get-started/">X-GovUK Eleventy Plugin</Link> setup
to regenerate them and use the 'govuk.css' and 'govuk.js' files to replace the equivalent in this projects under stylesheets and components respectively. Also update any urls in the 'govuk.scss' file with relative links directory to the images folder. For example:
```css:title=example-url.css
.govuk-footer__copyright-logo {
  background-image: url("../images/govuk-crest.png");
}
```
