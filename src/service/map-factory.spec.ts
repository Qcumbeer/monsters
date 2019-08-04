import { createFromFile } from './map-factory';
import { Subject } from 'rxjs';
import { WorldMap } from '../model/world-map';

describe('Map factory', () => {
  it('Creates map from proper file', async () => {
    const eventBus$ = new Subject<string>();

    const worldMap = await createFromFile(eventBus$, './data/world_map_small.txt', 10);

    expect(worldMap instanceof WorldMap).toBeTruthy();
  });

  it("Throws error when input file doesn't exist", async () => {
    const eventBus$ = new Subject<string>();

    const worldMapPromise = createFromFile(eventBus$, './not-existin-file', 10);

    await expect(worldMapPromise).rejects.toThrowError();
  });

  it('Throws error when invalid data in the input file', async () => {
    const eventBus$ = new Subject<string>();

    const worldMapPromise = createFromFile(eventBus$, './data/invalid.txt', 10);

    await expect(worldMapPromise).rejects.toThrowError();
  });
});
