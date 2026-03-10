// Global toast notification system
let _setToasts = null

export function registerToastSetter(fn) { _setToasts = fn }

let _id = 0
export function showToast(message, type = 'info', duration = 3500) {
  if (!_setToasts) return
  const id = ++_id
  _setToasts(prev => [...prev, { id, message, type }])
  setTimeout(() => {
    _setToasts(prev => prev.filter(t => t.id !== id))
  }, duration)
}
