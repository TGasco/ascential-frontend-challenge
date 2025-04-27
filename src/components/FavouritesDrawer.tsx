import React, { useEffect, useState } from "react"
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  Text,
  Box,
  LinkBox,
  Card,
  Heading,
  CardBody,
  LinkOverlay,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { Link as BrowserLink } from 'react-router-dom';
import { FavouritesData } from "../utils/addToFavourites"
import { useSeatGeek } from '../utils/useSeatGeek';
import FavouriteButton from "./FavouriteButton";

interface FavouritesDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FavouritesItemProps {
  type: 'event'|'venue';
  id: number;
}

const FavouritesDrawer: React.FC<FavouritesDrawerProps> = ({ isOpen, onClose }) => {
    const [favourites, setFavourites] = useState<FavouritesData>({
        events: {},
        venues: {}
    });
    useEffect(() => {
    const sync = () => {
        const storedData = localStorage.getItem('favourites')!;
        setFavourites(JSON.parse(storedData));
    }

    // initial load
    sync();

    window.addEventListener('favouritesUpdated', sync)
    return () =>
        window.removeEventListener('favouritesUpdated', sync)
    }, []);

    const eventIds = favourites?.events
      ? Object.keys(favourites.events).filter(k => favourites.events[k])
      : [];
    const venueIds = favourites?.venues
      ? Object.keys(favourites.venues).filter(k => favourites.venues[k])
      : [];

    return (
        <Drawer isOpen={isOpen} placement="start" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Favourites</DrawerHeader>
                <DrawerBody>
                    <Stack spacing={4}>
                        {eventIds.length === 0 && venueIds.length === 0 ? (
                            <Flex justify="center" align="center" height="100%">
                                <Text>No favourites found</Text>
                            </Flex>
                        ) : (
                        <React.Fragment>
                            <Box>
                                {eventIds.length === 0 ? (
                                    <></>
                                ) : (
                                    <>
                                        <Text fontSize="lg" fontWeight="bold">Events</Text>
                                        {eventIds.map(id => (
                                            <FavouritesItem
                                                key={id}
                                                type="event"
                                                id={Number(id)}
                                            />
                                        ))}
                                    </>
                                )}
                            </Box>

                            <Box>
                                {venueIds.length === 0 ? (
                                    <></>
                                ) : (
                                    <>
                                        <Text fontSize="lg" fontWeight="bold">Venues</Text>
                                        {venueIds.map(id => (
                                            <FavouritesItem
                                                key={id}
                                                type="venue"
                                                id={Number(id)}
                                            />
                                        ))}
                                    </>
                                )}
                            </Box>
                        </React.Fragment>
                        )}
                    </Stack>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

const FavouritesItem: React.FC<FavouritesItemProps> = ({ type, id }) => {
    const { data, error } = useSeatGeek(`/${type}s`, { id: id.toString() })

    if (error) return <Box>Error loading {type}</Box>
    if (!data) return (
        <Flex justify="center" align="center" minH="50px">
            <Spinner />
        </Flex>
    )

    const item = type === "event" ? data.events[0] : data.venues[0];
    const title = type === "event" ? item.short_title : item.name_v2;
    const linkTo = `/${type}s/${item.id}`

    return (
        <LinkBox as={Card} variant="outline" position="relative" p={3}>
            <CardBody>
                 <Flex 
                        direction={['column', 'row']} 
                        align="center" 
                        justify="space-between"
                      >
                    <Heading size="sm">
                        <LinkOverlay as={BrowserLink} to={linkTo}>
                            {title}
                        </LinkOverlay>
                    </Heading>
                    <Box as="span" mt={[2, 0]} ml={[0, 4]}>
                        <FavouriteButton
                            id={item.id}
                            itemType={type} />
                    </Box>
                      </Flex>
            </CardBody>
        </LinkBox>
    )
};

export default FavouritesDrawer;