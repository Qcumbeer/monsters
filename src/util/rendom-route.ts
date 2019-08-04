import { City } from '../model/city';

export const getRandomRoute = (city: City): City | null => {
  const routes = city.getRoutes();

  if (!routes.length) {
    return null;
  }

  return routes[Math.floor(Math.random() * routes.length)];
};
