import React, { useState } from 'react';
import handleAddToFavourites from '../utils/addToFavourites';
import { IconButton } from '@chakra-ui/react';
import { HiHeart } from 'react-icons/hi';

interface FavouriteButtonProps {
  id: number;
  itemType?: 'venue' | 'event';
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({ id, itemType = 'venue' }) => {
    // Initialize state from localStorage or default to false
  const [isFavourite, setIsFavourite] = useState(() => {
    const storedData = localStorage.getItem('favourites');
    const favourites = storedData ? JSON.parse(storedData) : { venues: {}, events: {} };
    const keyMap: Record<string, keyof typeof favourites> = {
      venue: 'venues',
      event: 'events',
    };
    const collectionKey = keyMap[itemType];
    return favourites[collectionKey]?.[id]?.isFavourite ?? false;
  });

  // Toggle favourite status
  const handleToggle = () => {
    // Update the state
    setIsFavourite(handleAddToFavourites(id, itemType));
  };

  return (
    <IconButton
      aria-label="Add to favourites"
      icon={<HiHeart />}
      colorScheme={isFavourite ? 'red' : 'gray'}
      onClick={handleToggle}
      variant={isFavourite ? 'solid' : 'outline'}
      rounded="full"
    />
  );
};

export default FavouriteButton;