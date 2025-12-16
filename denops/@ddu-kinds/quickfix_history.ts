import {
  type ActionArguments,
  ActionFlags,
  type Actions,
} from "@shougo/ddu-vim/types";
import { BaseKind } from "@shougo/ddu-vim/kind";
import { batch } from "@denops/std/batch";

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
