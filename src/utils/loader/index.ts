import fs from 'fs/promises'
import path from 'path'
import {Model} from 'mongoose'
import {config} from '@config'


async function readdirExclude(dir: string, exclude?: string[]): Promise<string[]> {
  const filenames = await fs.readdir(dir)
  const filenamesSet = new Set(filenames.map(filename => path.parse(filename).base))
  if (exclude) {
    exclude.forEach(filename => filenamesSet.delete(filename))
  }
  return Array.from(filenamesSet)
}

export async function loadModulesFromDir<T>(dir: string): Promise<Array<T>> {
  const filenames = await readdirExclude(dir, ['index.ts'])
  const modules = []

  for (const filename of filenames) {
    if (filename.endsWith('.ts')) {
      modules.push(import(dir + '/' + filename.replace('.ts', '')))
    }
  }

  return Promise.all(modules)
}

export async function loadRoutes<T>(dir: string): Promise<T[]> {
  const modules = await loadModulesFromDir<T>(dir)

  return modules.map(module => Object.values(module)).flat(1)
}

async function recursiveFindFilesByRegex(dirPath: string, regex: RegExp, result: string[] = []): Promise<void> {
  const files = await fs.readdir(dirPath)
  await Promise.all(files.map(async filename => {
    const filepath = path.resolve(dirPath, filename)
    const stat = await fs.stat(filepath)
    if (stat.isFile()) {
      if (filename.match(regex)) {
        result.push(filepath)
      }
    } else {
      await recursiveFindFilesByRegex(filepath, regex, result)
    }
  }))
}

export async function loadModels(): Promise<Model<any>[]> {
  const files: string[] = []
  await recursiveFindFilesByRegex(path.resolve(config.paths.root, './src/app'), /Model/, files)
  const models: {[key: string]: Model<any>}[] = await Promise.all(files.map(filepath => import(filepath)))
  return models.map(model => Object.values(model)).flat()
}