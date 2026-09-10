import { computed } from 'vue'
import { useUiStore } from '../stores/ui'
import { CURRENCY_RATES } from '../lib/config'

export function useCurrency() {
  const ui = useUiStore()

  const formatPrice = (amountUsd) => {
    const rate = CURRENCY_RATES[ui.currency] || 1
    const value = Number(amountUsd || 0) * rate
    try {
      return new Intl.NumberFormat(ui.locale === 'en' ? 'en-US' : ui.locale, {
        style: 'currency',
        currency: ui.currency
      }).format(value)
    } catch {
      return `$${value.toFixed(2)}`
    }
  }

  return {
    currency: computed(() => ui.currency),
    formatPrice
  }
}
