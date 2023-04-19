import { addCache, clearCache, getCache } from "./cache";

let timer: number

export function report(data: any) {
  const url = window._monitor_url;
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, JSON.stringify(data));
  } else {
    const image = new Image()
    image.src = `${url}?${JSON.stringify(data)}`
  }
  clearCache()
}

export function lazyReport(type: string, data: any) {
  if (timer) clearTimeout(timer)
  const log = {
    appId: window._monitor_appId,
    userId: window._monitor_uuId,
    type,
    data,
    currentTime: Date.now(),
    currentPage: location.href,
    ua: navigator.userAgent
  }

  addCache(JSON.stringify(log))

  const reportData = getCache()

  if (window._monitor_time === 0) return report(reportData)

  if (reportData.length === 10) return report(reportData)

  timer = setTimeout(() => {
    report(reportData)
  }, window._monitor_time)
}