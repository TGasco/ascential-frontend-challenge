import React, { useEffect, useState } from 'react';
import handleAddToFavourites from '../utils/addToFavourites';
import { IconButton } from '@chakra-ui/react';
import { HiHeart } from 'react-icons/hi';

interface FavouriteButtonProps {
  id: number;
  itemType?: 'venue' | 'event';
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({
  id,
  itemType = 'venue',
}) => {
  const [isFavourite, setIsFavourite] = useState(() => {
    const stored = localStorage.getItem('favourites');
    const favourites = stored
      ? JSON.parse(stored)
      : { venues: {}, events: {} };
    const key = itemType === 'venue' ? 'venues' : 'events';
    return favourites[key][id] ?? false;
  })

  // listen for all updates and re-read localStorage
  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem('favourites')!;
      const favourites = JSON.parse(stored);
      const key = itemType === 'venue' ? 'venues' : 'events';
      setIsFavourite(favourites[key][id] ?? false);
    }

    window.addEventListener('favouritesUpdated', sync);
    return () =>
      window.removeEventListener('favouritesUpdated', sync);
  }, [id, itemType]);

  const handleToggle = () => {
    // this will also re-dispatch the event
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
      data-testid="favourite-button"
      {...isFavourite ? { 'data-favourite': true } : {}}
    />
  )
}
export default FavouriteButton;