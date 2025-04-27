import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Flex,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Box,
  Spinner,
  AspectRatio
} from '@chakra-ui/react';
import Breadcrumbs from './Breadcrumbs';
import Error from './Error';
import { useSeatGeek } from '../utils/useSeatGeek';
import FavouriteButton from './FavouriteButton';

interface StatsProps {
  venue: {
    id: number;
    name: string;
    city: string;
    country: string;
    capacity: number;
  }
}

interface MapProps {
  location: {
    lat: number;
    lon: number;
  }
}

const Venue: React.FC = () => {
  const { venueId } = useParams();
  const { data: venue, error } = useSeatGeek(`venues/${venueId}`);

  if (error) return <Error />;

  if (!venue) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="50vh">
        <Spinner size="lg" data-testid="chakra-spinner" />
      </Flex>
    )
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Venues', to: '/venues' },
          { label: venue.name },
        ]} 
      />
      <Flex bgColor="gray.200" p={[4, 6]}>
        <Heading>{venue.name}</Heading>
      </Flex>
      <Stats venue={venue} />
      <Map location={venue.location} />
    </>
  );
};

const Stats: React.FC<StatsProps> = ({ venue }) => (
  <SimpleGrid 
    columns={[1, 1, 2]} 
    borderWidth="1px" 
    borderRadius="md" 
    m="6" 
    p="4" 
  >
    <Stat>
      <StatLabel display="flex">
        <Box as="span">Location</Box>
      </StatLabel>
      <StatNumber fontSize="xl">{venue.city}</StatNumber>
      <StatHelpText>{venue.country}</StatHelpText>
    </Stat>
    {venue.capacity > 0 && (
      <Stat>
        <StatLabel display="flex">
          <Box as="span">Capacity</Box>
        </StatLabel>
        <StatNumber fontSize="xl">{venue.capacity}</StatNumber>
      </Stat>
    )}
    <Stat>
      <StatLabel display="flex">
        <FavouriteButton
          id={venue.id}
        />
      </StatLabel>
    </Stat>
  </SimpleGrid>
);

const Map: React.FC<MapProps> = ({ location }) => (
  <AspectRatio ratio={16 / 5}>
    <Box
      as="iframe"
      src={`https://maps.google.com/maps?q=${location.lat},${location.lon}&z=15&output=embed`}
    />
  </AspectRatio>
);

export default Venue;