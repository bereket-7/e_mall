import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    notification: {
      show: false,
      type: 'info',
      title: '',
      message: '',
      duration: 5000
    },
    _timeoutId: null,
    locale: localStorage.getItem('locale') || 'en',
    currency: localStorage.getItem('currency') || 'USD'
  }),

  actions: {
    showNotification(config) {
      if (this._timeoutId) {
        clearTimeout(this._timeoutId)
        this._timeoutId = null
      }

      this.notification = {
        show: true,
        type: config.type || 'info',
        title: config.title || '',
        message: config.message || '',
        duration: config.duration ?? 5000
      }

      if (this.notification.duration > 0) {
        this._timeoutId = setTimeout(() => {
          this.hideNotification()
        }, this.notification.duration)
      }
    },

    hideNotification() {
      this.notification.show = false
      if (this._timeoutId) {
        clearTimeout(this._timeoutId)
        this._timeoutId = null
      }
    },

    setLocale(locale) {
      this.locale = locale
      localStorage.setItem('locale', locale)
    },

    setCurrency(currency) {
      this.currency = currency
      localStorage.setItem('currency', currency)
    }
  }
})
