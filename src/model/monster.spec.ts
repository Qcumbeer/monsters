import { Monster } from './monster';
import { City } from './city';
import { Subject } from 'rxjs';

describe('Monster', () => {
  const eventBus$ = new Subject<string>();

  it('Moves to another city', () => {
    const london = new City('London', eventBus$);
    const bournemouth = new City('Bournemouth', eventBus$);

    const monster = new Monster(1);
    monster.move(london);

    expect(london.getMonsters().length).toBe(1);

    monster.move(bournemouth);

    expect(london.getMonsters().length).toBe(0);
    expect(bournemouth.getMonsters().length).toBe(1);
  });

  it('Can move if city is not destroyed and has routes', () => {
    const london = new City('London', eventBus$);
    const bournemouth = new City('Bournemouth', eventBus$);
    london.setRoute(bournemouth, 'north');

    const monster = new Monster(1);
    monster.move(london);

    expect(monster.canMove()).toBeTruthy();
  });

  it('Cannot move if city has no routes', () => {
    const london = new City('London', eventBus$);

    const monster = new Monster(1);
    monster.move(london);

    expect(monster.canMove()).toBeFalsy();
  });

  it('Throws an error when trying to get city which is not set', () => {
    const monster = new Monster(1);

    expect(monster.getCity).toThrowError();
  });
});
