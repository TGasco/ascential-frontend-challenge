import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Venues from './components/Venues';
import Venue from './components/Venue';
import Events from './components/Events';
import Event from './components/Event';
import { Flex, Heading, IconButton } from '@chakra-ui/react';
import { IoMenu } from "react-icons/io5"
import FavouritesDrawer from './components/FavouritesDrawer';

const App: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <Router>
      <Nav onOpen={() => setIsDrawerOpen(true)} />
      <FavouritesDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/venues" Component={Venues} />
        <Route path="/venues/:venueId" Component={Venue} />
        <Route path="/events" Component={Events} />
        <Route path="/events/:eventId" Component={Event} />
      </Routes>
    </Router>
  );
};

const Nav: React.FC<{ onOpen: () => void }> = ({ onOpen }) => (
  <Flex
    as="nav"
    bg="gray.700"
    color="white"
    padding="24px"
  >
    <IconButton
      aria-label="Open Favourites Drawer"
      icon={<IoMenu size="2em" />}
      variant="none"
      size="sm"
      onClick={onOpen}
      marginRight="16px"
    ></IconButton>
    <Heading size="md">Ascential Front End Challenge</Heading>
  </Flex>
);

export default App;
