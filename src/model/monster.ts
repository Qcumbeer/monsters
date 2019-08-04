import { City } from './city';

export class Monster {
  private static MAX_MOVES = 10000;

  private city?: City;
  private moveCounter = 0;

  constructor(public num: number) {}

  public move(city: City): void {
    this.moveCounter++;

    if (this.city) {
      this.city.removeMonster(this);
    }

    this.city = city;
    city.addMonster(this);
  }

  public setCity(city: City): void {
    this.city = city;
  }

  public getCity(): City {
    if (!this.city) {
      throw new Error('Monster is out of city!');
    }

    return this.city;
  }

  public canMove(): boolean {
    return Boolean(
      this.city && !this.city.isDestroyed() && this.city.getRoutes().length && this.moveCounter < Monster.MAX_MOVES
    );
  }
}
