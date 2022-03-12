import fs from 'fs'
import path from 'path'
import {v4} from 'uuid'
import mv from 'mv'
import util from 'util'


async function validateFilepath(filepath: string): Promise<boolean> {
  try {
    await fs.promises.access(filepath)
    return false
  } catch {
    return true
  }
}

export async function createFilepath(dir: string, ext: string) {
  for (let i = 0; i < 5; i++) {
    const filepath = path.resolve(dir, v4() + '.' + ext)
    if (await validateFilepath(filepath)) {
      return filepath
    }
  }
  throw new Error('Failed create filepath')
}

export async function moveFile(from: string, to: string) {
  await util.promisify(mv)(from, to)
  return to
}