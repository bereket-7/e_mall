import { useUiStore } from '../stores/ui'

/**
 * @returns {{ notify: (config: { type?: string, title?: string, message?: string, duration?: number }) => void }}
 */
export function useNotification() {
  const ui = useUiStore()

  return {
    notify(config) {
      ui.showNotification(config)
    }
  }
}
