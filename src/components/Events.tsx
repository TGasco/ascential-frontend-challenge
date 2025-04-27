import React from 'react';
import {
  SimpleGrid,
  Flex,
  Spinner,
  Heading,
  Text,
  Box,
  Card,
  CardBody,
  Stack,
  Image,
  LinkBox,
  LinkOverlay, 
  Tooltip
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import Error from './Error';
import { useSeatGeek } from '../utils/useSeatGeek';
import { formatDateTime } from '../utils/formatDateTime';

export interface Performers {
  image: string;
}

export interface Venue {
  name_v2: string;
  display_location: string;
  timezone: string;
}

export interface EventProps {
  id: string;
  short_title: string;
  datetime_utc: Date;
  performers: Performers[];
  venue: Venue;
}

interface EventItemProps {
  event: EventProps;
}

const Events: React.FC = () => {
  const { data, error } = useSeatGeek('/events', { 
    type: 'concert',
    sort: 'score.desc',
    per_page: '24',
  });

  if (error) return <Error />;

  if (!data) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="50vh">
        <Spinner size="lg" data-testid="chakra-spinner" />
      </Flex>
    )
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Events' }]} />
      <SimpleGrid spacing="6" m="6" minChildWidth="350px">
        {data.events?.map((event: EventProps) => (
          <EventItem key={event.id.toString()} event={event} />
        ))}
      </SimpleGrid>
    </>
  );
};

const EventItem: React.FC<EventItemProps> = ({ event }) => (
  <LinkBox 
    as={Card} 
    variant="outline"
    overflow="hidden"
    bg="gray.50"
    borderColor="gray.200"
    _hover={{ bg: 'gray.100' }}
  >
    <Image src={event.performers[0].image} />
    <CardBody>
      <Stack spacing="2">
        <Heading size="md">
          <LinkOverlay as={Link} to={`/events/${event.id}`}>{event.short_title}</LinkOverlay>
        </Heading>
        <Box>
          <Text fontSize="sm" color="gray.600">
            {event.venue.name_v2}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {event.venue.display_location}
          </Text>
        </Box>
        <Tooltip
          hasArrow
          label={formatDateTime(event.datetime_utc)}
        >
          <Text 
            fontSize="sm"
            fontWeight="bold"
            color="gray.600"
            justifySelf="end"
            data-testid="date"
          >
            <Link 
              to={`/events/${event.id}`}
            >
              {formatDateTime(event.datetime_utc, event.venue.timezone)}
            </Link>
          </Text>
        </Tooltip>
      </Stack>
    </CardBody>
  </LinkBox>
);

export default Events;