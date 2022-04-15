import fs from 'fs'
import path from 'path'
import {v4} from 'uuid'
import mv from 'mv'
import util from 'util'
import {logger as defaultLogger} from '@logger'


const logger = defaultLogger.child({label: 'fs'})


async function validateFilepath(filepath: string): Promise<boolean> {
  try {
    await fs.promises.access(filepath)
    return false
  } catch {
    return true
  }
}

export async function isExistFile(dir: string, filename: string) {
  try {
    await fs.promises.access(path.resolve(dir, filename))
    return true
  } catch {
    return false
  }
}

export async function createFilepath(dir: string, ext: string) {
  for (let i = 0; i < 5; i++) {
    const filename = v4() + '.' + ext
    const filepath = path.resolve(dir, filename)
    if (await validateFilepath(filepath)) {
      return {filename, filepath}
    }
  }
  throw new Error('Failed create filepath')
}

export async function moveFile(from: string, to: string) {
  await util.promisify(mv)(from, to)
  return to
}

export async function deleteFile(dir: string, filename: string) {
  try {
    await fs.promises.rm(path.resolve(dir, filename))
    return true
  } catch(error) {
    logger.error(error)
    return false
  }
}

export async function readDir(dir: string): Promise<string[]> {
  return await fs.promises.readdir(dir)
}