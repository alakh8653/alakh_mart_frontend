import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function readJSON<T>(filename: string, fallback: T): T {
  ensureDataDir()
  const filepath = path.join(DATA_DIR, filename)
  try {
    if (!fs.existsSync(filepath)) return fallback
    const content = fs.readFileSync(filepath, 'utf8')
    return JSON.parse(content) as T
  } catch (e) {
    console.error('readJSON error', e)
    return fallback
  }
}

export function writeJSON<T>(filename: string, data: T) {
  ensureDataDir()
  const filepath = path.join(DATA_DIR, filename)
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8')
}

export function resetFile(filename: string) {
  writeJSON(filename, [])
}

export default {
  readJSON,
  writeJSON,
  resetFile,
}
