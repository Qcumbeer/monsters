import * as Joi from '@hapi/joi';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { Subject } from 'rxjs';
import { Direction } from '../model/city';
import { WorldMap } from '../model/world-map';
import { validate } from './validator';

export const createFromFile = (eventBus$: Subject<string>, path: string, monsters: number): Promise<WorldMap> =>
  new Promise((resolve, reject) => {
    const input = createReadStream(path);
    const rl = createInterface({ input });
    const worldMap = new WorldMap(monsters, eventBus$);

    input.on('error', e => reject(new Error(`Can't load file: ${e.message}`)));
    rl.on('line', line => {
      try {
        handleLine(worldMap)(line);
      } catch (e) {
        reject(new Error(`Invalid line: ${e.message}`));
        rl.close();
      }
    });
    rl.on('close', () => resolve(worldMap));
  });

const handleLine = (worldMap: WorldMap) => (line: string) => {
  const lineSchema = Joi.string()
    .regex(/^[^\s]+\s((north|south|east|west)=[^\s]+\s){0,3}(north|south|east|west)=[^\s]+$/)
    .required();

  validate(line, lineSchema);

  const name = line.match(/^(?<name>[^\s]+)/)!;
  const connections = line.match(/((north|south|east|west)=[^\s]+)/g)!.map(conn => {
    const [direction, destination] = conn.split('=') as [Direction, string];
    return { direction, destination };
  });

  worldMap.upsertCity((name.groups as any).name, connections);
};
