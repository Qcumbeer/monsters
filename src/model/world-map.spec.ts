import { WorldMap } from './world-map';
import { Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { City } from './city';

let latestIndex: number;

jest.mock('../util/random-city', () => ({
  getRandomCity: (collection: Map<string, City>) => {
    const aliveCities = Array.from(collection.values()).filter(city => !city.isDestroyed());

    if (!aliveCities.length) {
      return null;
    }

    const keys = aliveCities.map(city => city.name);
    return collection.get(keys[Math.min(keys.length - 1, latestIndex++)])!;
  },
}));

describe('World map', () => {
  beforeEach(() => {
    latestIndex = 0;
  });

  it('Upserts new city', async () => {
    const eventBus$ = new Subject<string>();
    const worldMap = new WorldMap(2, eventBus$);

    const city = worldMap.upsertCity('London', [{ destination: 'Bournemouth', direction: 'west' }]);
    expect(city.name).toBe('London');
    expect(city.west!.name).toBe('Bournemouth');
  });

  it('Destroys city with 2 monsters during releasing monsters', async () => {
    const eventBus$ = new Subject<string>();
    const worldMap = new WorldMap(2, eventBus$);

    const eventPromise = eventBus$.pipe(toArray()).toPromise();

    worldMap.upsertCity('London');
    worldMap.start();

    eventBus$.complete();

    const messages = await eventPromise;
    expect(messages.length).toBe(1);
  });

  it('Kills all monsters during game', async () => {
    const eventBus$ = new Subject<string>();
    const worldMap = new WorldMap(4, eventBus$);

    const eventPromise = eventBus$.pipe(toArray()).toPromise();

    /*
    MAP:
    Swindon ------ London
       |              |
    Bournemouth -- Brighton
    */
    worldMap.upsertCity('London', [
      { destination: 'Brighton', direction: 'south' },
      { destination: 'Swindon', direction: 'west' },
    ]);
    worldMap.upsertCity('Brighton', [
      { destination: 'London', direction: 'north' },
      { destination: 'Bournemouth', direction: 'west' },
    ]);
    worldMap.upsertCity('Bournemouth', [
      { destination: 'Brighton', direction: 'east' },
      { destination: 'Swindon', direction: 'north' },
    ]);
    worldMap.upsertCity('Swindon', [
      { destination: 'London', direction: 'east' },
      { destination: 'Bournemouth', direction: 'south' },
    ]);

    worldMap.start();

    eventBus$.complete();

    const messages = await eventPromise;
    expect(messages.length).toBe(2);
  });
});
