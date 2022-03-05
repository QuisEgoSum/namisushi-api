import fs from 'fs/promises'
import path from 'path'


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