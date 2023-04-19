import { Options } from "../type/core";
import { AutoTrackerReport } from "./DomTracker";
import { ErrorTrackerReport } from "./ErrorTracker";

export default class Tracker {
  
  data: Options;
  constructor(options: Options) {
    this.data = Object.assign(this.defaultOptions(), options);
    this.installTracker()
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
    if (this.data.ErrorTracker) {
        ErrorTrackerReport()
    }
    if (this.data.DOMTracker) {
        AutoTrackerReport()
    }
    if (this.data.HashTracker) {
    }
    if (this.data.HistoryTracker) {
    }
  }
}
