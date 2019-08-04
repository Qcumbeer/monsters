import { Monster } from './monster';
import { City } from './city';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

describe('City', () => {
  it('Sets route to another city', () => {
    const eventBus$ = new Subject<string>();
    const london = new City('London', eventBus$);
    const bournemouth = new City('Bournemouth', eventBus$);

    london.setRoute(bournemouth, 'north');
    expect(london.north).toBe(bournemouth);
    expect(bournemouth.south).toBe(london);
  });

  it('Destroyes when 2 monsters moved into the city', async () => {
    const eventBus$ = new Subject<string>();
    const london = new City('London', eventBus$);
    const bournemouth = new City('Bournemouth', eventBus$);

    london.setRoute(bournemouth, 'east');

    const firstMonster = new Monster(1);
    const secondMonster = new Monster(2);

    const eventPromise = eventBus$.pipe(first()).toPromise();

    firstMonster.move(london);
    secondMonster.move(london);

    const message = await eventPromise;

    expect(message).toBe('London has been destroyed by monster 1 and monster 2!');
    expect(london.isDestroyed()).toBeTruthy();
    expect(london.east).toBe(undefined);
    expect(bournemouth.west).toBe(undefined);
  });
});
