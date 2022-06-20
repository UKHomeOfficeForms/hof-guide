/* eslint-disable no-loop-func */
import _ from 'lodash';
import { generateDirTree, formatTitle } from './parse-links-to-tree';

class SiteTree {
  constructor(pageContext) {
    this.pageContext = pageContext;
    this.pageTitle = formatTitle(pageContext.title);
  }

  generateTreeData(data) {
    let root = { children: [] }; // create origin

    for (var obj of data) { // loop items in the data
      obj.type = 'Page'; // add a property to suit your output
      let tree = root; // start at root every object

      for (var subDir of obj.directoryTree) { // loop over items in subDir
        let branch = tree.children.find(k => k.title === formatTitle(subDir)); // look for branch

        if (!branch) { // if no branch, create one
          branch = {
            title: formatTitle(subDir),
            type: 'Directory',
            path: obj.path.substring(0, obj.path.indexOf(subDir)) + subDir,
            children: []
          };
          tree.children.push(branch); // push this into children of current level
        }
        tree = branch; // set tree to branch before processing next item in subDir
      }
      if (!obj.isDirectory) {
        obj.title = formatTitle(obj.title);
        tree.children.push(obj); // add the item to the hierarchy after subDir is exhausted
      }
    }
    return root.children; // return children of the root to suit your output
  }

  generateSiteTreeFromPage(nodes) {
    const isSitemap = this.isSitemap();
    // parse through node paths in response from graphql
    let relevantUris = nodes
                        .map(node => node.path)
                        // filter page paths associated with current page onwards
                        .filter(path => isSitemap ? path : path.startsWith(this.pageContext.slug))
                        // generate brearcrumb directory tree array and return props
                        .map(path => {
                          let directoryTree = generateDirTree(`${path}/`);
                          const title = path.split('/').reverse()[0];

                          return {
                            path,
                            title,
                            directoryTree,
                            isDirectory: false
                          };
                        });
    // generate array of all subdirectories of current page
    const allSubDirs = _.uniq(relevantUris.map(uri => uri.directoryTree.join('/'))).sort();
    // establish if end page route is a directory and update obj props if so
    relevantUris = relevantUris.map(obj => {
      const isEndDirectory = allSubDirs.filter(dir => {
        return dir.endsWith(`/${obj.title}`) || dir === obj.title;
      }).length;

      if (isEndDirectory) {
        obj.directoryTree.push(obj.title);
        obj.isDirectory = true;
      }
      return obj;
    });
    // sort by directory tree array and then by url path
    relevantUris = _.sortBy(relevantUris, ['directoryTree', 'path']);

    let navTree = this.generateTreeData(relevantUris);

    if (isSitemap) {
      navTree = navTree.filter(obj => obj.children && obj.children.filter(n => n.path).length);
    }

    return navTree;
  }

  isSitemap() {
    return this.pageContext.slug.endsWith('/sitemap');
  }
}


export default SiteTree;
