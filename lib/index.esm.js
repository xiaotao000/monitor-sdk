/**
 * 获取元素的dom路径
 * @param {*} element
 * @returns
 */
function getPathTo(element) {
    if (element.id !== '')
        return '//*[@id="' + element.id + '"]';
    if (element === document.body)
        return element.tagName;
    let ix = 0;
    let siblings = element.parentElement.children;
    for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];
        if (sibling === element)
            return (getPathTo(element.parentElement) + '/' + element.tagName + '[' + (ix + 1) + ']');
        if ((sibling === null || sibling === void 0 ? void 0 : sibling.nodeType) === 1 && sibling.tagName === element.tagName)
            ix++;
    }
}

function AutoTrackerReport() {
    console.log('自动埋点');
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
        console.log('action', log);
    });
}
function actionCatcher(type, message) {
    const log = { type, message };
    console.log('action', log);
}

function ErrorTrackerReport() {
    function SourceErrorReport(e) {
        const target = e.target;
        const log = {
            errorType: "sourceError",
            message: `${target.tagName}资源加载错误`,
            file: target.src || target.href,
        };
        console.log("--- 资源加载错误 ---", log);
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
        console.log("--- js报错 ---", log);
    });
    window.addEventListener("unhandledrejection", function (e) {
        const log = {
            errorType: 'promiseError',
            message: e.reason,
            error: e.reason
        };
        console.log('----Promise错误----', log);
    });
}
function ErrorCatcher(message, error) {
    const log = {
        errorType: 'jsError',
        message: message,
        error: error
    };
    console.log('---js错误----', log);
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
        if (this.data.ErrorTracker) {
            ErrorTrackerReport();
        }
        if (this.data.DOMTracker) {
            AutoTrackerReport();
        }
        if (this.data.HashTracker) ;
        if (this.data.HistoryTracker) ;
    }
}

function init(options) {
    new Tracker(options);
}

export { ErrorCatcher, actionCatcher, init };
