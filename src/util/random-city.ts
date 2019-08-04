import { City } from '../model/city';

export const getRandomCity = (collection: Map<string, City>): City | null => {
  const aliveCities = Array.from(collection.values()).filter(city => !city.isDestroyed());

  if (!aliveCities.length) {
    return null;
  }

  const keys = aliveCities.map(city => city.name);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];

  return collection.get(randomKey)!;
};
