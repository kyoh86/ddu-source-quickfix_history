import {
  ActionArguments,
  ActionFlags,
  BaseSource,
  Item,
} from "https://deno.land/x/ddu_vim@v2.9.2/types.ts";
// import { fn } from "https://deno.land/x/ddu_vim@v2.9.2/deps.ts";

export type ActionData = {
  nr: string;
};

type Params = Record<never, never>;

export class Source extends BaseSource<Params> {
  kind = "quickfix_history";
  gather({ denops, sourceParams }): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      start(controller) {
        try {
          // TODO: build item and enqueue with controller.enqueue()
        } catch (e) {
          console.error(e);
        }
        controller.close();
      },
    });
  }

  actions = {
    edit: async ({ denops, items }: ActionArguments<Params>) => {
      const action = items[0]?.action as ActionData;
      // TODO:
      return Promise.resolve(ActionFlags.None);
    },
  };

  params(): Params {
    return {};
  }
}
