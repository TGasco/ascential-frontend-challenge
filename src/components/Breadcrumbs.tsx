import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

interface BreadcrumbItemData {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItemData[];
}

const Breadcrumbs: React.FC<BreadcrumbProps> = ({ items }) => (
  <Breadcrumb
    m="6"
    spacing="1"
    separator={<ChevronRightIcon color="gray.500" data-testid="chakra-breadcrumb-separator" />}
  >
    {items.map((item, index) => {
      const isCurrentPage = items.length === index + 1;
      return (
        <BreadcrumbItem isCurrentPage={isCurrentPage} key={item.label}>
          <BreadcrumbLink
            as={!isCurrentPage ? Link : undefined}
            to={!isCurrentPage ? item.to : undefined}
          >
            {item.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
      );
    })}
  </Breadcrumb>
);

export default Breadcrumbs;
