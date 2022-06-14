import React from 'react'
import { Breadcrumb } from 'gatsby-plugin-breadcrumb'

const BreadcrumbLink = ({ crumbs, title }) => {
  const adjustedCrumbs = crumbs.map(obj => {
    obj.crumbLabel = obj.crumbLabel.replace(/_/g, ' ');
    return obj;
  });

  return (
    <Breadcrumb
      crumbs={adjustedCrumbs}
      crumbSeparator=" › "
      crumbLabel={title}
    />
  )
}

export default BreadcrumbLink;
