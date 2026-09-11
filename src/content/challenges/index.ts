import { algorithms } from "./algorithms";
import { arrays } from "./arrays";
import { asyncChallenges } from "./async";
import { debugging } from "./debugging";
import { dom } from "./dom";
import { functions } from "./functions";
import { fundamentals } from "./fundamentals";
import { modern } from "./modern";
import { objects } from "./objects";
import { build } from "./shared";
import { strings } from "./strings";

export const challenges = build([
  ...fundamentals,
  ...strings,
  ...arrays,
  ...functions,
  ...objects,
  ...algorithms,
  ...modern,
  ...asyncChallenges,
  ...dom,
  ...debugging,
]);

export type { ChallengeSeed } from "./shared";
