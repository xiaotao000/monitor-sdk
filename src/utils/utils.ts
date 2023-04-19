/**
 * 获取元素的dom路径
 * @param {*} element
 * @returns
 */
export function getPathTo(element: HTMLElement): string | undefined {
  if (element.id !== "") return '//*[@id="' + element.id + '"]';
  if (element === document.body) return element.tagName;
  let ix = 0;
  let siblings = element.parentElement!.children;
  for (let i = 0; i < siblings.length; i++) {
    let sibling = siblings[i];
    if (sibling === element)
      return (
        getPathTo(element.parentElement as HTMLElement) +
        "/" +
        element.tagName +
        "[" +
        (ix + 1) +
        "]"
      );
    if (sibling?.nodeType === 1 && sibling.tagName === element.tagName) ix++;
  }
}

export function createHistoryTracker<T extends keyof History>(type: T) {
  const origin = history[type];
  return function (this: any) {
    const res = origin.apply(this, arguments);
    const event = new Event(type);
    window.dispatchEvent(event);
    return res;
  };
}

export function batchAddLister (events: string[], fn: () => void) {
  events.forEach(event => {
    window.addEventListener(event, fn)
  })
}