import { Options } from "../type/core";
import { AutoTrackerReport } from "./DomTracker";
import { ErrorTrackerReport } from "./ErrorTracker";
import { HashTrackerReport, HistoryTrackerReport } from "./PageTracker";

export default class Tracker {
  data: Options;
  constructor(options: Options) {
    this.data = Object.assign(this.defaultOptions(), options);
    this.installTracker();
  }
  defaultOptions() {
    return {
      appId: "",
      uuId: "",
      requestUrl: "",
      ErrorTracker: false,
      DOMTracker: false,
      HashTracker: false,
      HistoryTracker: false,
    };
  }
  installTracker() {
    const { requestUrl, uuId, appId, cacheTime } = this.data;
    // 将请求地址保存到window
    window["_monitor_url"] = requestUrl;
    window["_monitor_uuId"] = uuId;
    window["_monitor_appId"] = appId;
    window["_monitor_time"] = cacheTime || 0;
    if (this.data.ErrorTracker) {
      ErrorTrackerReport();
    }
    if (this.data.DOMTracker) {
      AutoTrackerReport();
    }
    if (this.data.HashTracker) {
      HashTrackerReport();
    }
    if (this.data.HistoryTracker) {
      HistoryTrackerReport();
    }
  }
}
