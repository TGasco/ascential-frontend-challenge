import React from 'react';
import { Flex, Heading, Text, Box, Badge, LinkBox, LinkOverlay } from '@chakra-ui/react';
import { Link as BrowserLink } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import FavouriteButton from './FavouriteButton';
import InfiniteGrid, { fetchAbstractPage } from './InfiniteGrid';

export interface VenueProps {
  id: number;
  has_upcoming_events: boolean;
  num_upcoming_events: number;
  name_v2: string;
  display_location: string;
}

interface VenuItemProps {
  venue: VenueProps;
}

const fetchVenuesPage = (page: number, query: Record<string, string>) =>
  fetchAbstractPage<VenueProps>('/venues', 'venues', page, query, '24');

const Venues: React.FC = () => (
  <InfiniteGrid<VenueProps, Record<string, string>>
    fetchPage={fetchVenuesPage}
    query={{ sort: 'score.desc' }}
    renderItem={venue => <VenueItem key={venue.id} venue={venue} />}
    breadcrumbs={<Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Venues' }]} />}
  />
);

const VenueItem: React.FC<VenuItemProps> = ({ venue }) => (
  <LinkBox>
    <Box        
      p={[4, 6]}
      bg="gray.50"
      borderColor="gray.200"
      borderWidth="1px"
      justifyContent="center" 
      alignContent="center"
      rounded="lg"
      _hover={{ bg: 'gray.100' }}
    >
      <Flex 
        direction={['column', 'row']} 
        align="center" 
        justify="space-between"
      >
        <Box flex="1">
          <Badge colorScheme={venue.has_upcoming_events ? 'green' : 'red'} mb="2">
            {`${venue.has_upcoming_events ? venue.num_upcoming_events : 'No'} Upcoming Events`}
          </Badge>
          <Heading size='sm' noOfLines={1}>
            <LinkOverlay as={BrowserLink} to={`/venues/${venue.id}`}>
              {venue.name_v2}
            </LinkOverlay>
          </Heading>
          <Text fontSize="sm" color="gray.500">{venue.display_location}</Text>
        </Box>
        <Box as="span" mt={[2, 0]} ml={[0, 4]}>
          <FavouriteButton
            id={venue.id}
          />
        </Box>
      </Flex>
    </Box>
  </LinkBox>
);

export default Venues;