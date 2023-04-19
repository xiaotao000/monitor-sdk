import { getPathTo } from "../utils/utils";
import { lazyReport } from "./report";

export function AutoTrackerReport() {  
  document.body.addEventListener("click", function (e) {
    const target = e.target as HTMLElement
    const isNo = target.getAttribute('data-no')
    const message = target.getAttribute('data-tracker')
    if (isNo != null) return
    const log = {
        type: 'click',
        message: message || getPathTo(target)
      }
      lazyReport('action', log)
  });
}

export function actionCatcher(type: string, message: string) {
    const log = { type, message }
    lazyReport('action', log);
}
