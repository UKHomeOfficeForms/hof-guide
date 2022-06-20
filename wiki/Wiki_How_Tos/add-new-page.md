---
title: Add New Page
tags: ["add-page"]
---
```toc
```
## Creating wiki posts

1. Create md file in `wiki/<topic>/<post>.md`

2. You can copy the below code as a template for your .md file. The minimum you need is a 'title' and a table of contents (toc) which ensures any headers are anchored so you may navigate the page more easily.

````md:title=example-topic-matter.md
---
title: Example Title
---
```toc
# This code block gets replaced with the Table Of Contents
```
## Initial Header
````
3. Add post content 👌. N.B. - **An initial header is needed if you are using the `toc` section.**
4. FYI - you can name the directory and the filename anything. In the markdown matter, `title` drives the content in the UI and any nested directories within the `/wiki` folder drives the sidebar navigation tree to the left along with the site routing.

## Additional Tips & Tricks

### File Hierarchy
