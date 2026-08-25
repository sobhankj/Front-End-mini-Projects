/**
 * Desktop/mouse focused — detect coarse pointers and skip forcing whip UX.
 */
export function isCoarsePointerDevice(): boolean {
  return window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;
}

export function hasFinePointer(): boolean {
  return window.matchMedia('(pointer: fine)').matches || window.matchMedia('(any-pointer: fine)').matches;
}
