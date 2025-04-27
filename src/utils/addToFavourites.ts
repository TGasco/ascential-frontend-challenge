type ItemType = 'venue' | 'event';

interface FavouritesData {
    venues: Record<string, { isFavourite: boolean }>;
    events: Record<string, { isFavourite: boolean }>;
    [key: string]: Record<string, { isFavourite: boolean }>;
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

    const currentStatus = favourites[collectionKey][id]?.isFavourite ?? false;
    const newStatus = !currentStatus;
    favourites[collectionKey][id] = { isFavourite: newStatus };

    localStorage.setItem('favourites', JSON.stringify(favourites));

    return newStatus;
};
export default handleAddToFavourites;