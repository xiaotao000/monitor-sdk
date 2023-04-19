import { getPathTo } from "../utils/utils";

export function AutoTrackerReport() {
  console.log('自动埋点');
  
  document.body.addEventListener("click", function (e) {
    const target = e.target as HTMLElement
    const isNo = target.getAttribute('data-no')
    const message = target.getAttribute('data-tracker')
    if (isNo != null) return
    const log = {
        type: 'click',
        message: message || getPathTo(target)
      }
      console.log('action', log)
  });
}

export function actionCatcher(type: string, message: string) {
    const log = { type, message }
    console.log('action', log);
}
