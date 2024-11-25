import { match } from "oxide.ts";

import type { Result } from "oxide.ts";

export const q = <T, E>(result: Result<T, E>): T => {
  return match(result, {
    Err: (err) => {
      throw Error("failed to unwrap", { cause: err });
    },
    Ok: (val) => val,
  });
};
