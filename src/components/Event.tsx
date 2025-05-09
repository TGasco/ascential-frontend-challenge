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
  Button,
  Stack,
  Tooltip,
} from '@chakra-ui/react';
import Breadcrumbs from './Breadcrumbs';
import Error from './Error';
import { useSeatGeek } from '../utils/useSeatGeek';
import { formatDateTime } from '../utils/formatDateTime';
import { type Venue } from './Events';
import FavouriteButton from './FavouriteButton';

interface EventInfoProps {
  event: {
    id: number;
    short_title: string;
    datetime_utc: Date;
    venue: Venue;
    url: string;
  };
}

const Event: React.FC = () => {
  const { eventId } = useParams();
  const { data: event, error } = useSeatGeek(`events/${eventId}`);

  if (error) return <Error />;

  if (!event) {
    return (
      <Flex justifyContent="center" alignItems="center" minHeight="50vh">
        <Spinner size="lg" data-testid="chakra-spinner" />
      </Flex>
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          { label: 'Events', to: '/events' },
          { label: event.short_title },
        ]}
      />
      <Flex bgColor="gray.200" p={[4, 6]}>
        <Heading>{event.short_title}</Heading>
      </Flex>
      <EventInfo event={event} />
    </>
  );
};

const EventInfo: React.FC<EventInfoProps> = ({ event }) => (
  <Stack spacing="6" m="6">
    <SimpleGrid columns={[1, 1, 2]} borderWidth="1px" borderRadius="md" p="4">
      <Stat>
        <StatLabel display="flex">
          <Box as="span">Venue</Box>
        </StatLabel>
        <StatNumber fontSize="xl">{event.venue.name_v2}</StatNumber>
        <StatHelpText>{event.venue.display_location}</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel display="flex">
          <Box as="span">Date</Box>
        </StatLabel>
        <StatNumber fontSize="xl">
          <Tooltip hasArrow label={formatDateTime(event.datetime_utc)}>
            <Box data-testid="date" sx={{ display: 'inline-block' }}>
              {formatDateTime(event.datetime_utc, event.venue.timezone)}
            </Box>
          </Tooltip>
        </StatNumber>
      </Stat>
      <Stat>
        <StatLabel display="flex">
          <FavouriteButton id={event.id} itemType="event" />
        </StatLabel>
      </Stat>
    </SimpleGrid>
    <Flex>
      <Button as={'a'} href={event.url} minWidth="0">
        Buy Tickets
      </Button>
    </Flex>
  </Stack>
);

export default Event;
