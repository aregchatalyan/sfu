const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null
}
const positionWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element
  if (type === 'rectangle') {
    const topLeft = nearPoint(x, y, x1, y1, 'tl')
    const topRight = nearPoint(x, y, x2, y1, 'tr')
    const bottomLeft = nearPoint(x, y, x1, y2, 'bl')
    const bottomRight = nearPoint(x, y, x2, y2, 'br')
    const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null
    return topLeft || inside || topRight || bottomLeft || bottomRight
  } else {
    const a = { x: x1, y: y1 }
    const b = { x: x2, y: y2 }
    const c = { x, y }
    const offset = distance(a, b) - (distance(a, c) + distance(b, c))
    const start = nearPoint(x, y, x1, y1, 'start')
    const end = nearPoint(x, y, x2, y2, 'end')
    const inside = Math.abs(offset) < 1 ? 'inside' : null
    return start || end || inside
  }
}
const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))

export const getElementAtPosition = (x, y, elements) => {
  return elements
    .map((ele) => ({
      ...ele,
      position: positionWithinElement(x, y, ele),
    }))
    .find((ele) => ele.position !== null)
}

export const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element
  if (type === 'rectangle') {
    const minX = Math.min(x1, x2)
    const maxX = Math.max(x1, x2)
    const minY = Math.min(y1, y2)
    const maxY = Math.max(y1, y2)
    return { x1: minX, y1: minY, x2: maxX, y2: maxY }
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 }
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 }
    }
  }
}
export const cursorForPosition = (position) => {
  switch (position) {
    case 'tl':
    case 'br':
    case 'start':
    case 'end':
      return 'nwse-resize'
    case 'tr':
    case 'bl':
      return 'nesw-resize'
    default:
      return 'move'
  }
}
export const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates
  switch (position) {
    case 'tl':
    case 'start':
      return { x1: clientX, y1: clientY, x2, y2 }
    case 'tr':
      return { x1, y1: clientY, x2: clientX, y2 }
    case 'bl':
      return { x1: clientX, y1, x2, y2: clientY }
    case 'br':
    case 'end':
      return { x1, y1, x2: clientX, y2: clientY }
    default:
      return null
  }
}
