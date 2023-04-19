// // History模式监听器

import { batchAddLister, createHistoryTracker } from "../utils/utils";
import { lazyReport } from "./report";

export function HistoryTrackerReport() {
  history.pushState = createHistoryTracker("pushState");
  history.replaceState = createHistoryTracker("replaceState");
  const eventList = ["pushState", "replaceState", "popstate", "load", "unload"];
  pageTrackerReport(eventList);
}

//  Hash模式监听器
export function HashTrackerReport() {
  history.pushState = createHistoryTracker("pushState");
  const eventList = ["pushState", "popstate", "hashChange", "load", "unload"];
  pageTrackerReport(eventList);
}

function pageTrackerReport(eventList: string[]) {
  let pageName = location.href;
  let startTime = Date.now();
  function getStayTime() {
    const time = Date.now() - startTime;
    startTime = Date.now();
    return time;
  }
  batchAddLister(eventList, lister);
  function lister() {
    const log = {
      page: pageName,
      stayTime: getStayTime(),
    };
    lazyReport("---page改变了---", log);
    pageName = location.href;
  }
}