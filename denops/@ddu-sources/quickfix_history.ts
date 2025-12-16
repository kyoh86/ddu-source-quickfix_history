import type { Item } from "@shougo/ddu-vim/types";
import { BaseSource } from "@shougo/ddu-vim/source";
import type { Denops } from "@denops/std";
import * as fn from "@denops/std/function";

import type { ActionData } from "../@ddu-kinds/quickfix_history.ts";

type SourceParams = Record<PropertyKey, never>;

export class Source extends BaseSource<SourceParams> {
  override kind = "quickfix_history";

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
        } finally {
          controller.close();
        }
      },
    });
  }

  params(): SourceParams {
    return {};
  }
}
