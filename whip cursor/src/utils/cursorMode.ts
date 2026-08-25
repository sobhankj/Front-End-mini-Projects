/**
 * Hide system cursor over the page when whip overlay is active,
 * but keep interactive controls usable (cursor restored on UI).
 */
export function setWhipCursorMode(active: boolean): void {
  document.documentElement.classList.toggle('whip-active', active);
}
