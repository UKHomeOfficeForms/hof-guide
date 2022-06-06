---
title: Add New Page
tags: ["add-page"]
---

## Creating wiki posts

1. Create md file in `wiki/<topic>/<post>.md`

2. Setup frontmatter at the top of the file like so:

```md:title=example-topic-matter.md
---
title: 'blah'
path: '/<topic>/<post>.md'
---
```

3. Add post content 👌
4. FYI - you can name the directory and the filename anything. In the markdown matter, `title` drives the content in the UI and `path` drives the folder structure in the side navigation bar to the left. We mirror these in the directory and filenames so everything is organised and easier to follow if changes are made.
