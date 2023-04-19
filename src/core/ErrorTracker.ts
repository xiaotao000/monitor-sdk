import { ErrorReport } from "../type/core";
import { SourceElement } from "../type/dom";

export function ErrorTrackerReport() {
  function SourceErrorReport(e: ErrorEvent) {
    const target = e.target as SourceElement;
    const log: ErrorReport = {
      errorType: "sourceError",
      message: `${target.tagName}资源加载错误`,
      file: target.src || target.href,
    };
    console.log("--- 资源加载错误 ---", log);
  }
  window.addEventListener("error", function (e) {
    const target = e.target;
    const isSource = target instanceof HTMLImageElement || target instanceof HTMLScriptElement || target instanceof HTMLLinkElement
    if (isSource) return SourceErrorReport(e)
    // errorType 错误类型 file 错误文件  row col 错误位置  error 错误对象  message 错误信息
    const log: ErrorReport = {
      errorType: "jsError",
      message: e.message,
      file: e.filename,
      row: e.lineno,
      col: e.colno,
      error: e.error,
    };
    console.log("--- js报错 ---", log);
  });
  window.addEventListener("unhandledrejection", function (e) {
    const log: ErrorReport = {
        errorType: 'promiseError',
        message: e.reason,
        error: e.reason
      }
      console.log('----Promise错误----', log)
  });
}

export function ErrorCatcher(message: string, error: any) {
    const log: ErrorReport = {
      errorType: 'jsError',
      message: message,
      error: error
    }
    console.log('---js错误----', log)
  }
  