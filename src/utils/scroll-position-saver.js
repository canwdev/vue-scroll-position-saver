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
      targetEl = window, // 执行滚动监听的dom元素，默认window
      name = 'default', // 保存 localStorage 的标识符名称后缀
      timeout = -1, // 超时自动清除滚动进度（毫秒），传入-1关闭
      debug = false, // 是否开启调试日志
      autoRestore = 0, // 是否开启自动恢复，默认在实例化0毫秒后恢复，传入-1关闭
      refreshOnly = false, // 是否只在刷新之后恢复，切换页面或关闭页面重新载入不恢复
      debounceInterval = 300, // 滚动监听防抖间隔时间（毫秒）
    } = options

    this.timeout = timeout
    this.debug = debug
    this.targetEl = targetEl
    this.name = name
    this.LS_KEY_SCROLL_TOP = `LS_KEY_SP_SAVER__${name}`
    this.isRestored = false
    this.isDestroying = false

    this.handleScroll = this.handleScroll.bind(this)
    this.handleScrollDebounced = debounce(debounceInterval, false, (self) => {
      if (!self.isRestored || self.isDestroying) {
        return
      }

      const scrollEl = self.getScrollTarget()
      const top = scrollEl.scrollTop
      const left = scrollEl.scrollLeft
      self.debugLog('>>> handleScrollDebounced', top)

      setStore(self.LS_KEY_SCROLL_TOP, {
        top,
        left,
        timestamp: +new Date(),
      })
    })

    targetEl.addEventListener('scroll', this.handleScroll)

    if (refreshOnly) {
      const pageAccessedByReload = this.checkIsReload()

      if (!pageAccessedByReload) {
        this.debugWarn('page is NOT reload')
        return
      }
      this.debugWarn('page is reload')
    }

    if (autoRestore > -1) {
      setTimeout(() => {
        this.restoreScrollTop()
      }, autoRestore)
    }
  }

  // 检查页面是否刷新
  // 注意：在Vue路由切换时可能会误判，此时请使用beforeRouteEnter处理。
  checkIsReload() {
    return (
      (window.performance.navigation && window.performance.navigation.type === 1) ||
      window.performance
        .getEntriesByType('navigation')
        .map((nav) => nav.type)
        .includes('reload')
    )
  }

  debugLog(...args) {
    this.debug && console.log(`[SPS LOG][${this.name}]`, ...args)
  }

  debugWarn(...args) {
    this.debug && console.warn(`[SPS WARN][${this.name}]`, ...args)
  }

  destroy() {
    this.isDestroying = true
    this.targetEl.removeEventListener('scroll', this.handleScroll)
  }

  clear() {
    this.debugWarn('clear')
    localStorage.removeItem(this.LS_KEY_SCROLL_TOP)
  }

  handleScroll() {
    this.handleScrollDebounced(this)
  }

  getScrollTarget() {
    if (this.targetEl === window) {
      return document.documentElement
    }
    return this.targetEl
  }

  updateScrollPosition({top = 0, left = 0} = {}) {
    const scrollEl = this.getScrollTarget()

    scrollEl.scrollTop = top
    scrollEl.scrollLeft = left
  }

  // 还原滚动高度
  restoreScrollTop() {
    const { top = 0, left = 0, timestamp } = getStore(this.LS_KEY_SCROLL_TOP)
    this.debugLog('<<< restoreScrollTop', {top, left, timestamp})


    if (timestamp && this.timeout > 0) {
      const t = Date.now() - timestamp
      if (t > this.timeout) {
        this.debugWarn(`timeout ${t} > ${this.timeout}`)
        this.clear()
        this.isRestored = true
        this.updateScrollPosition()
        return
      }
    }
    this.isRestored = true
    this.updateScrollPosition({
      top,
      left
    })
  }
}
