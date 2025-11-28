import * as React from "react";

function Skeleton(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="animate-pulse rounded-md bg-muted"
      {...props}
    />
  );
}

export { Skeleton };
