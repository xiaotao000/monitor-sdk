/**
 * 获取元素的dom路径
 * @param {*} element
 * @returns
 */
function getPathTo(element) {
    if (element.id !== "")
        return '//*[@id="' + element.id + '"]';
    if (element === document.body)
        return element.tagName;
    let ix = 0;
    let siblings = element.parentElement.children;
    for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];
        if (sibling === element)
            return (getPathTo(element.parentElement) +
                "/" +
                element.tagName +
                "[" +
                (ix + 1) +
                "]");
        if ((sibling === null || sibling === void 0 ? void 0 : sibling.nodeType) === 1 && sibling.tagName === element.tagName)
            ix++;
    }
}
function createHistoryTracker(type) {
    // 1. 复制原方法
    const origin = history[type];
    // 2. 返回一个
    return function () {
        // 调用原方法
        const res = origin.apply(this, arguments);
        // 创建自定义事件并触发
        const event = new Event(type);
        window.dispatchEvent(event);
        return res;
    };
}
function batchAddLister(events, fn) {
    events.forEach(event => {
        window.addEventListener(event, fn);
    });
}

// 资源缓存数组
const cache = [];
function addCache(item) {
    cache.push(item);
}
function getCache() {
    return cache;
}
function clearCache() {
    cache.length = 0;
}

let timer;
function report(data) {
    const url = window._monitor_url;
    if (navigator.sendBeacon) {
        navigator.sendBeacon(url, JSON.stringify(data));
    }
    else {
        const image = new Image();
        image.src = `${url}?${JSON.stringify(data)}`;
    }
    clearCache();
}
function lazyReport(type, data) {
    if (timer)
        clearTimeout(timer);
    const log = {
        appId: window._monitor_appId,
        userId: window._monitor_uuId,
        type,
        data,
        currentTime: Date.now(),
        currentPage: location.href,
        ua: navigator.userAgent
    };
    addCache(JSON.stringify(log));
    const reportData = getCache();
    if (window._monitor_time === 0)
        return report(reportData);
    if (reportData.length === 10)
        return report(reportData);
    timer = setTimeout(() => {
        report(reportData);
    }, window._monitor_time);
}

function AutoTrackerReport() {
    document.body.addEventListener("click", function (e) {
        const target = e.target;
        const isNo = target.getAttribute('data-no');
        const message = target.getAttribute('data-tracker');
        if (isNo != null)
            return;
        const log = {
            type: 'click',
            message: message || getPathTo(target)
        };
        lazyReport('action', log);
    });
}
function actionCatcher(type, message) {
    const log = { type, message };
    lazyReport('action', log);
}

function ErrorTrackerReport() {
    function SourceErrorReport(e) {
        const target = e.target;
        const log = {
            errorType: "sourceError",
            message: `${target.tagName}资源加载错误`,
            file: target.src || target.href,
        };
        lazyReport("--- 资源加载错误 ---", log);
    }
    window.addEventListener("error", function (e) {
        const target = e.target;
        const isSource = target instanceof HTMLImageElement || target instanceof HTMLScriptElement || target instanceof HTMLLinkElement;
        if (isSource)
            return SourceErrorReport(e);
        // errorType 错误类型 file 错误文件  row col 错误位置  error 错误对象  message 错误信息
        const log = {
            errorType: "jsError",
            message: e.message,
            file: e.filename,
            row: e.lineno,
            col: e.colno,
            error: e.error,
        };
        lazyReport("--- js报错 ---", log);
    });
    window.addEventListener("unhandledrejection", function (e) {
        const log = {
            errorType: 'promiseError',
            message: e.reason,
            error: e.reason
        };
        lazyReport('----Promise错误----', log);
    });
}
function ErrorCatcher(message, error) {
    const log = {
        errorType: 'jsError',
        message: message,
        error: error
    };
    lazyReport('---js错误----', log);
}

// // History模式监听器
function HistoryTrackerReport() {
    history.pushState = createHistoryTracker("pushState");
    history.replaceState = createHistoryTracker("replaceState");
    const eventList = ["pushState", "replaceState", "popstate", "load", "unload"];
    pageTrackerReport(eventList);
}
//  Hash模式监听器
function HashTrackerReport() {
    history.pushState = createHistoryTracker("pushState");
    const eventList = ["pushState", "popstate", "hashChange", "load", "unload"];
    pageTrackerReport(eventList);
}
function pageTrackerReport(eventList) {
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

class Tracker {
    constructor(options) {
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

function init(options) {
    new Tracker(options);
    lazyReport('user', { message: 'SDK加载' });
    window.addEventListener('unload', () => {
        const reportData = getCache();
        if (reportData.length)
            report(reportData);
    });
}

export { ErrorCatcher, actionCatcher, init };
