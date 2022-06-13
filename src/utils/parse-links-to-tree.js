/**
 * Turn the file structure of posts into a nav tree
 *
 * - /
 *   - about
 *   - sub-directory/
 *                  - sub-topic
 *
 * [
 *  {
 *    directory: '/',
 *    links: [
 *      {
 *        path: '/about',
 *        title: 'About'
 *      },
 *      {
 *        directory: 'sub-topic',
 *        links: [
 *          {
 *            path: '/sub-topic/sub-topic',
 *            title: 'Sub Topic Post'
 *          }
 *        ]
 *      }
 *    ]
 *  }
 * ]
 */
const parseLinksToTree = pages => {
  const mergedPages = pages.map(page => {
    const mergedFields = Object.assign({}, page.node.fields, page.node.frontmatter);
    mergedFields.path = constructPageUrl(mergedFields);
    return mergedFields;
  });

  const navTree = mergedPages.reduce(
    (tree, page) => {
      // Split the uri into its directories
      const uri = page.path.replace(/_/g, ' ').split('/');
      const root = tree[0];
      // Keep track of current directory when building the tree
      let pwd = root;

      if (uri.length > 2) {
        // Iterate through each segment of the uri, creating directories and links
        for (let i = 1; i < uri.length; i++) {
          // The final element of uri is a link
          if (i === uri.length - 1) {
            pwd.links = [...pwd.links, page];
          } else {
            // Navigate to the existing directory _or_ create a new directory and navigate to it
            const segment = uri[i];
            const new_dir = pwd.links.find(l => l.directory === segment);

            if (new_dir) {
              pwd = new_dir;
            } else {
              pwd.links = [
                ...pwd.links,
                {
                  directory: segment,
                  links: [],
                },
              ];
              pwd = pwd.links.find(l => l.directory === segment);
            }
          }
        }
      } else {
        // The uri has no subdirectories, add it to the root
        root.links = [...root.links, page];
      }

      return tree;
    },
    [
      {
        directory: '/',
        links: [],
      },
    ]
  );

  return navTree;
};

const constructDirBreadcrumbs = slug => {
  const dirsArr = slug.match(/(?<=\/)(.*?)(?=\/)/g);
  dirsArr.pop();
  return dirsArr.join(' › ').replace(/_/g, ' ');
};

const constructPageUrl = page => {
  const matterPath = page.path;
  let parentDir = page.slug.split('/').filter(uri => uri);
  parentDir.pop();
  parentDir = parentDir.join('/');

  return matterPath ? `/${parentDir}${matterPath}` : page.slug.slice(0, -1);
};

const goToPage = page => {
  return window.location.href = constructPageUrl(page);
};

module.exports = {
  parseLinksToTree,
  constructPageUrl,
  constructDirBreadcrumbs,
  goToPage
};
