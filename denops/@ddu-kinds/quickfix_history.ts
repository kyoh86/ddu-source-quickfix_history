import {
  ActionArguments,
  ActionFlags,
  Actions,
  BaseKind,
} from "https://deno.land/x/ddu_vim@v3.5.1/types.ts";
import { batch } from "https://deno.land/x/ddu_vim@v3.5.1/deps.ts";

export type ActionData = {
  nr: number;
  title: string;
};

type Params = Record<PropertyKey, never>;

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
