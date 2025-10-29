const adjectives = [
  'Brave', 'Swift', 'Clever', 'Noble', 'Bright', 'Calm', 'Bold', 'Wise',
  'Quick', 'Happy', 'Lucky', 'Mighty', 'Proud', 'Silent', 'Wild', 'Free',
  'Sharp', 'Keen', 'Pure', 'True', 'Grand', 'Fair', 'Strong', 'Kind',
]

const nouns = [
  'Eagle', 'Lion', 'Tiger', 'Wolf', 'Bear', 'Fox', 'Hawk', 'Owl',
  'Dolphin', 'Whale', 'Phoenix', 'Dragon', 'Falcon', 'Raven', 'Panther', 'Jaguar',
  'Elephant', 'Cheetah', 'Leopard', 'Lynx', 'Otter', 'Panda', 'Koala', 'Penguin',
]

export function generateRandomName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adjective}${noun}`
}

export function generateRoomName(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 7)
  return `jamie-${timestamp}-${random}`
}
