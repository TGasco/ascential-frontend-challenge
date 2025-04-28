type ItemType = 'venue' | 'event';

export interface FavouritesData {
  venues: Record<string, boolean>;
  events: Record<string, boolean>;
  [key: string]: Record<string, boolean>;
}

const handleAddToFavourites = (id: number, type: ItemType): boolean => {
  const storedData = localStorage.getItem('favourites');
  const favourites: FavouritesData = storedData
    ? JSON.parse(storedData)
    : { venues: {}, events: {} };

  const keyMap: Record<ItemType, keyof FavouritesData> = {
    venue: 'venues',
    event: 'events',
  };

  const collectionKey = keyMap[type];

  // ensure the collection exists
  if (!favourites[collectionKey]) {
    favourites[collectionKey] = {};
  }

  const currentStatus = favourites[collectionKey][id] ?? false;
  const newStatus = !currentStatus;

  if (newStatus) {
    favourites[collectionKey][id] = true;
  } else {
    delete favourites[collectionKey][id];
  }

  localStorage.setItem('favourites', JSON.stringify(favourites));

  // dispatch a global event so every button can hear about the change
  window.dispatchEvent(new Event('favouritesUpdated'));

  return newStatus;
};

export default handleAddToFavourites;
