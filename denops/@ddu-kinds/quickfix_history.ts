import {
  ActionArguments,
  ActionFlags,
  Actions,
  BaseKind,
} from "https://deno.land/x/ddu_vim@v4.1.1/types.ts";
import { batch } from "https://deno.land/x/ddu_vim@v4.1.1/deps.ts";

export type ActionData = {
  nr: number;
  title: string;
};

type Params = Record<PropertyKey, never>;

export const QuickfixHistoryActions = {
  open: async ({ denops, items }: ActionArguments<Params>) => {
    const action = items[0]?.action as ActionData;
    await batch(denops, async (denops) => {
      await denops.cmd(`${action.nr}chistory`);
      await denops.cmd("copen");
    });
    return Promise.resolve(ActionFlags.None);
  },
};

export class Kind extends BaseKind<Params> {
  actions: Actions<Params> = QuickfixHistoryActions;
  params(): Params {
    return {};
  }
}
