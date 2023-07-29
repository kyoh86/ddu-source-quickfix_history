import {
  ActionArguments,
  ActionFlags,
  Actions,
  BaseKind,
} from "https://deno.land/x/ddu_vim@v3.4.4/types.ts";
import { batch } from "https://deno.land/x/ddu_vim@v3.4.4/deps.ts";

export type ActionData = {
  nr: number;
  title: string;
};

type Params = Record<never, never>;

export class Kind extends BaseKind<Params> {
  override actions: Actions<Params> = {
    open: async ({ denops, items }: ActionArguments<Params>) => {
      const action = items[0]?.action as ActionData;
      await batch(denops, async (denops) => {
        await denops.cmd(`${action.nr}chistory`);
        await denops.cmd("copen");
      });
      return Promise.resolve(ActionFlags.None);
    },
  };
  params(): Params {
    return {};
  }
}
