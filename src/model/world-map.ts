import { Subject } from 'rxjs';
import { getRandomCity } from '../util/random-city';
import { getRandomRoute } from '../util/rendom-route';
import { City, Direction } from './city';
import { Monster } from './monster';

interface Connection {
  direction: Direction;
  destination: string;
}

export class WorldMap {
  private cities: Map<string, City> = new Map();
  private monsters: Map<number, Monster> = new Map();

  constructor(monstersAmount: number, private eventBus$: Subject<string>) {
    Array(monstersAmount)
      .fill(null)
      .forEach((_, index) => this.monsters.set(index + 1, new Monster(index + 1)));
  }

  public upsertCity(name: string, connections?: Connection[]): City {
    let city = this.cities.get(name);

    if (!city) {
      city = new City(name, this.eventBus$);
      this.cities.set(name, city);
    }

    if (connections) {
      this.addConnections(city, connections);
    }

    return city;
  }

  public start() {
    this.releaseMonsters();

    while (this.isGameInProgress()) {
      this.monsters.forEach(monster => {
        const city = getRandomRoute(monster.getCity());

        if (!city || !monster.canMove()) {
          this.monsters.delete(monster.num);
          return;
        }

        monster.move(city);

        if (city.isDestroyed()) {
          city.getMonsters().forEach(cityMonster => this.monsters.delete(cityMonster.num));
        }
      });
    }
  }

  private releaseMonsters(): void {
    this.monsters.forEach(monster => {
      const city = getRandomCity(this.cities);

      if (city) {
        monster.move(city);

        if (city.isDestroyed()) {
          city.getMonsters().forEach(cityMonster => this.monsters.delete(cityMonster.num));
        }
      }
    });
  }

  private addConnections(city: City, connections: Connection[]): void {
    connections.forEach(({ direction, destination }) => {
      const route = this.upsertCity(destination);
      city.setRoute(route, direction);
    });
  }

  private isGameInProgress(): boolean {
    return (
      Boolean(this.monsters.size) &&
      Array.from(this.monsters.values()).reduce((result: boolean, curr: Monster) => result && curr.canMove(), true)
    );
  }
}
