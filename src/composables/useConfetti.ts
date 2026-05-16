export function useConfetti() {
  function burst(x: number, y: number) {
    const colors = ['#f43f5e', '#fb7185', '#fda4af', '#fbbf24', '#34d399', '#60a5fa']
    const container = document.body

    for (let i = 0; i < 28; i++) {
      const el = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = 6 + Math.random() * 6
      const angle = Math.random() * 360
      const distance = 60 + Math.random() * 80
      const dx = Math.cos((angle * Math.PI) / 180) * distance
      const dy = Math.sin((angle * Math.PI) / 180) * distance

      Object.assign(el.style, {
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
        background: color,
        pointerEvents: 'none',
        zIndex: '9999',
        transition: 'transform 0.7s ease-out, opacity 0.7s ease-out',
        transform: 'translate(0,0) rotate(0deg)',
        opacity: '1',
      })

      container.appendChild(el)

      requestAnimationFrame(() => {
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle * 3}deg)`
        el.style.opacity = '0'
      })

      setTimeout(() => el.remove(), 800)
    }
  }

  return { burst }
}
