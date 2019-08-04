import * as Joi from "@hapi/joi";
import { Subject } from "rxjs";
import { createFromFile } from "./service/map-factory";
import { validate } from "./service/validator";

interface Config {
  dataPath: string;
  monsters: number;
}

const configSchema = Joi.object({
  dataPath: Joi.string().required(),
  monsters: Joi.number()
    .integer()
    .min(0)
    .required()
});

export const app = async (config: Config, eventBus$: Subject<string>) => {
  validate(config, configSchema, true);

  const map = await createFromFile(eventBus$, config.dataPath, config.monsters);
  map.start();
};
