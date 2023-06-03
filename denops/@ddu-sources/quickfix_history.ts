import {
  ActionArguments,
  ActionFlags,
  BaseSource,
  Item,
} from "https://deno.land/x/ddu_vim@v2.9.2/types.ts";
import { batch, Denops, fn } from "https://deno.land/x/ddu_vim@v2.9.2/deps.ts";

export type ActionData = {
  nr: number;
  title: string;
};

type SourceParams = Record<never, never>;

export class Source extends BaseSource<SourceParams> {
  kind = "quickfix_history";

  gather(args: { denops: Denops }): ReadableStream<Item<ActionData>[]> {
    return new ReadableStream({
      async start(controller) {
        try {
          await Promise.all(
            [...Array(10)].map(async (_, i) => {
              const history = await fn.getqflist(args.denops, {
                nr: i + 1,
                id: 0,
                title: true,
                size: true,
                // items: true, // NOTE: when it supports "preview", quickfix_history needs "items"
              });
              if (!history.size) return;
              controller.enqueue([{
                word: history.title as string,
                action: history as ActionData,
              }]);
            }),
          );
        } catch (e) {
          console.error(e);
        }
        controller.close();
      },
    });
  }

  actions = {
    open: async ({ denops, items }: ActionArguments<SourceParams>) => {
      const action = items[0]?.action as ActionData;
      await batch(denops, async (denops) => {
        await denops.cmd(`${action.nr}chistory`);
        await denops.cmd("copen");
      });
      return Promise.resolve(ActionFlags.None);
    },
  };

  params(): SourceParams {
    return {};
  }
}
