import React from 'react';
import { Flex, Heading, SimpleGrid, type LinkProps, LinkOverlay, LinkBox, Box } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Link } from "react-router-dom";

interface PageLinkProps extends LinkProps {
  children: React.ReactNode;
  url: string;
}

const Home: React.FC = () => (
  <SimpleGrid columns={{ sm: 1, md: 2 }} spacing="6" m="6">
    <PageLink url="/venues">Browse Venues</PageLink>
    <PageLink url="/events">Browse Events</PageLink>
  </SimpleGrid>
);

const PageLink: React.FC<PageLinkProps> = ({ url, children }) => (
  <LinkBox as={Box}>
    <Flex 
      p="6"
      bg="gray.50"
      borderColor="gray.200"
      borderWidth="1px"
      justifyContent="space-between" 
      alignItems="center"
      rounded="lg"
      _hover={{ bg: "gray.100" }}
    >
      <Heading size="md">
        <LinkOverlay as={Link} to={url}>{children}</LinkOverlay>
      </Heading>
      <ArrowForwardIcon boxSize={6} data-testid="chakra-arrow-forward"/>
    </Flex>
  </LinkBox>
);

export default Home;