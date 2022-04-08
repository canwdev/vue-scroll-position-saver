import { debounce } from 'throttle-debounce'

const getStore = (key) => {
  return JSON.parse(localStorage.getItem(key) || '{}')
}
const setStore = (key, obj = {}) => {
  localStorage.setItem(key, JSON.stringify(obj))
}
const updateStore = (key, obj) => {
  setStore(key, {
    ...getStore(key),
    ...obj,
  })
}

const handleScrollDebounced = debounce(300, false, (self) => {
  if (!self.isRestored || self.isDestroying) {
    return
  }

  const scrollEl = self.getScrollTarget()
  const top = scrollEl.scrollTop
  self.debugLog('>>> handleScrollDebounced', top)

  setStore(self.LS_KEY_SCROLL_TOP, {
    top,
    timestamp: +new Date(),
  })
})

/**
 * 保存页面滚动高度，在下一次页面加载后恢复。
 * // 初始化
 * this.spSaver = new ScrollPositionSaver({name: 'test_name'})
 * // 销毁页面时清除事件绑定
 * this.spSaver && this.spSaver.destroy()
 */
export class ScrollPositionSaver {
  constructor(options = {}) {
    const {
      targetEl = window,
      name = 'default', // 保存 localStorage 的标识符名称后缀
      timeout = -1, // 超时自动清除滚动进度（毫秒），传入-1关闭
      debug = false,
      autoRestore = 0, // 是否开启自动恢复，默认在实例化0毫秒后恢复，传入-1关闭
      refreshOnly = false, // 是否只在刷新之后恢复，切换页面或关闭页面重新载入不恢复
    } = options
    this.timeout = timeout
    this.debug = debug
    this.targetEl = targetEl
    this.LS_KEY_SCROLL_TOP = `LS_KEY_SP_SAVER__${name}`
    this.isRestored = false
    this.isDestroying = false

    this.updateScrollPosition = this.updateScrollPosition.bind(this)

    targetEl.addEventListener('scroll', this.updateScrollPosition)

    if (refreshOnly) {
      if (!this.checkIsReload()) {
        this.debugWarn('refresh only forbid!!')
        return
      }
      this.debugWarn('refresh only worked!!')
    }

    if (autoRestore > -1) {
      setTimeout(() => {
        this.restoreScrollTop()
      }, autoRestore)
    }
  }

  checkIsReload() {
    const st = sessionStorage.getItem(this.LS_KEY_SCROLL_TOP)
    if (st === location.href) {
      return true
    }
    sessionStorage.setItem(this.LS_KEY_SCROLL_TOP, location.href)
    return false
  }

  debugLog(...args) {
    this.debug && console.log('[SPS LOG]', ...args)
  }

  debugWarn(...args) {
    this.debug && console.warn('[SPS WARN]', ...args)
  }

  destroy() {
    this.isDestroying = true
    this.targetEl.removeEventListener('scroll', this.updateScrollPosition)
  }

  clear() {
    this.debugWarn('clear')
    localStorage.removeItem(this.LS_KEY_SCROLL_TOP)
  }

  updateScrollPosition() {
    handleScrollDebounced(this)
  }

  getScrollTarget() {
    if (this.targetEl === window) {
      return document.documentElement
    }
    return this.targetEl
  }

  // 还原滚动高度
  restoreScrollTop() {
    const { top = 0, timestamp } = getStore(this.LS_KEY_SCROLL_TOP)
    this.debugLog('<<< restoreScrollTop', top, timestamp)

    const scrollEl = this.getScrollTarget()

    if (timestamp && this.timeout > 0) {
      const t = Date.now() - timestamp
      if (t > this.timeout) {
        this.debugWarn(`timeout ${t} > ${this.timeout}`)
        this.clear()
        this.isRestored = true
        scrollEl.scrollTop = 0
        return
      }
    }
    this.isRestored = true
    if (!top) {
      scrollEl.scrollTop = 0
      return
    }

    scrollEl.scrollTop = top
  }
}