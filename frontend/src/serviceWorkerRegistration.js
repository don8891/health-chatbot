export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/sw.js`

      navigator.serviceWorker.register(swUrl)
        .then(reg => console.log('SW registered:', reg.scope))
        .catch(err => console.log('SW error:', err))
    })
  }
}
