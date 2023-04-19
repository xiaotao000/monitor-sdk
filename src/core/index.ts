import { Options } from "../type/core";
import Tracker from "./Tracker";
import { ErrorCatcher }  from './ErrorTracker'
import { actionCatcher } from './DomTracker'
import { lazyReport, report } from "./report";
import { getCache } from "./cache";

export function init(options: Options) {
  new Tracker(options)
  lazyReport('user', { message: 'SDK加载' })
  window.addEventListener('unload', () => {
    const reportData = getCache()
    if (reportData.length) report(reportData)
  })
}

export { ErrorCatcher, actionCatcher }