/**
 * Document visibility handling — pause simulation cleanly.
 */
export function onVisibilityChange(
  onHidden: () => void,
  onVisible: () => void,
): () => void {
  const handler = (): void => {
    if (document.visibilityState === 'hidden') onHidden();
    else onVisible();
  };
  document.addEventListener('visibilitychange', handler);
  return () => document.removeEventListener('visibilitychange', handler);
}
