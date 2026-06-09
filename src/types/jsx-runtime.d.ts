// Ensure JSX is typed correctly even if react types are temporarily missing/broken.
// This is a minimal fallback for the TS language service.

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

