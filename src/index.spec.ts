import { app } from "./index";
import { Subject } from "rxjs";
import { toArray } from "rxjs/operators";

describe("App", () => {
  it("Validates config", async () => {
    const eventBus$ = new Subject<string>();
    // @ts-ignore
    await expect(app({}, eventBus$)).rejects.toThrowError();
    await expect(app({ dataPath: "test", monsters: -1 }, eventBus$)).rejects.toThrowError();
  });

  it("Runs the small game", async () => {
    const eventBus$ = new Subject<string>();
    const eventPromise = eventBus$.pipe(toArray()).toPromise();

    await expect(app({ monsters: 12, dataPath: "./data/world_map_small.txt" }, eventBus$)).resolves.toBeUndefined();

    eventBus$.complete();

    const messages = await eventPromise;
    expect(messages.length).toBe(6);
  });
});
