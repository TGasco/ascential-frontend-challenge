import React from 'react';
import {
  Flex,
  Heading,
  Text,
  Box,
  Card,
  CardBody,
  Stack,
  Image,
  LinkBox,
  LinkOverlay,
  Tooltip,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import { formatDateTime } from '../utils/formatDateTime';
import FavouriteButton from './FavouriteButton';
import InfiniteGrid, { fetchAbstractPage } from './InfiniteGrid';

export interface Performers {
  image: string;
}

export interface Venue {
  name_v2: string;
  display_location: string;
  timezone: string;
}

export interface EventProps {
  id: number;
  short_title: string;
  datetime_utc: Date;
  performers: Performers[];
  venue: Venue;
}

interface EventItemProps {
  event: EventProps;
}

const fetchEventsPage = (page: number, query: Record<string, string>) =>
  fetchAbstractPage<EventProps>('/events', 'events', page, query, '12');

const Events: React.FC = () => (
  <InfiniteGrid<EventProps, Record<string, string>>
    fetchPage={fetchEventsPage}
    query={{ sort: 'score.desc' }}
    renderItem={(event) => <EventItem key={event.id} event={event} />}
    breadcrumbs={<Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Events' }]} />}
  />
);

export const EventItem: React.FC<EventItemProps> = ({ event }) => (
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
      <Flex direction={['column', 'row']} align="center" justify="space-between">
        <Stack spacing="2">
          <Heading size="md">
            <LinkOverlay as={Link} to={`/events/${event.id}`}>
              {event.short_title}
            </LinkOverlay>
          </Heading>
          <Box>
            <Text fontSize="sm" color="gray.600">
              {event.venue.name_v2}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {event.venue.display_location}
            </Text>
          </Box>
          <Tooltip hasArrow label={formatDateTime(event.datetime_utc)}>
            <Text
              fontSize="sm"
              fontWeight="bold"
              color="gray.600"
              justifySelf="end"
              data-testid="date"
            >
              <Link to={`/events/${event.id}`}>
                {formatDateTime(event.datetime_utc, event.venue.timezone)}
              </Link>
            </Text>
          </Tooltip>
        </Stack>
        <FavouriteButton id={event.id} itemType="event" />
      </Flex>
    </CardBody>
  </LinkBox>
);

export default Events;
