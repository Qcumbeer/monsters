import { getRandomCity } from './random-city';
import { City } from '../model/city';
import { Subject } from 'rxjs';

describe('Random city', () => {
  const eventBus$ = new Subject<string>();

  it('Chooses random city', () => {
    const collection = new Map<string, City>();
    collection.set('London', new City('London', eventBus$));
    collection.set('Bournemouth', new City('Bournemouth', eventBus$));

    const city = getRandomCity(collection);
    expect(typeof city!.name).toBe('string');
  });

  it('Returns null when no cities in collection', () => {
    const collection = new Map<string, City>();

    const city = getRandomCity(collection);
    expect(city).toBe(null);
  });
});
