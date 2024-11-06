'use strict'

;(() => {
    const scriptEl = document.createElement('script')
    scriptEl.setAttribute('src', chrome.runtime.getURL('mi.js'))
    document.getElementsByTagName('body')[0].appendChild(scriptEl)
})()