import { Subject } from 'rxjs';
import { Monster } from './monster';

export type Direction = 'north' | 'south' | 'east' | 'west';

export class City {
  public north?: City;
  public south?: City;
  public east?: City;
  public west?: City;
  private monsters: Map<number, Monster> = new Map();
  private destroyed = false;

  constructor(public name: string, private emitter$: Subject<string>) {}

  public setRoute(city: City, direction: Direction): void {
    this[direction] = city;

    const opposite = this.getOppositeDirection(direction);
    city[opposite] = this;
  }

  public addMonster(monster: Monster): void {
    this.monsters.set(monster.num, monster);
    monster.setCity(this);

    if (this.monsters.size > 1) {
      const [firstMonster, secondMonster] = this.getMonsters();
      this.destroy();
      this.emitter$.next(
        `${this.name} has been destroyed by monster ${firstMonster.num} and monster ${secondMonster.num}!`
      );
    }
  }

  public removeMonster(monster: Monster): void {
    this.monsters.delete(monster.num);
  }

  public getMonsters(): Monster[] {
    return Array.from(this.monsters.values());
  }

  public isDestroyed(): boolean {
    return this.destroyed;
  }

  public getRoutes(): City[] {
    return [this.north!, this.south!, this.east!, this.west!].filter(city => city && !city.isDestroyed());
  }

  private getOppositeDirection(direction: Direction): Direction {
    const oposites: { [key in Direction]: Direction } = {
      north: 'south',
      south: 'north',
      east: 'west',
      west: 'east',
    };

    return oposites[direction];
  }

  private destroy() {
    this.destroyed = true;

    for (const direction of ['north', 'south', 'east', 'west']) {
      this.removeRoute(direction as Direction);
    }
  }

  private removeRoute(direction: Direction): void {
    const city = this[direction];

    if (city) {
      this[direction] = undefined;
      const opposite = this.getOppositeDirection(direction);
      city[opposite] = undefined;
    }
  }
}
