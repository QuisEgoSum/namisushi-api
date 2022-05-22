import path from 'path'
import type {Logger} from 'pino'


interface PkgJson {
  readonly name: string,
  readonly version: string
}

interface ConfigPaths {
  readonly shareStatic: string
  readonly root: string
}

interface ConfigServer {
  readonly address: {
    readonly api: string
    readonly admin: string
    readonly user: string
  }
  readonly http: {
    readonly address: string
    readonly port: number
  },
  readonly cors: {
    readonly allowedOrigins: string[]
    readonly allowedHeaders: string[]
  }
  readonly csp: {
    readonly directives: {
      readonly defaultSrc: string[]
      readonly  data: string[]
      readonly [key: string]: string[] | any
    }
  }
  readonly telegram: {
    readonly token: string
    readonly enableBot: boolean
    readonly enableWebhook: boolean
    readonly webhook: {
      readonly port: number
      readonly hookPath: string
      readonly domain: string
    }
  }
  readonly ws: {
    readonly port: number
  }
}

interface LoggerConfig {
  readonly pretty: boolean,
  readonly isoTime: boolean,
  readonly time: boolean,
  readonly level: 'info' | 'debug'
}

interface UserConfig {
  readonly otp: {
    debug: boolean
  }
  readonly session: {
    readonly maximum: number
    readonly cookie: {
      path: string,
      domain: string,
      sameSite: boolean | "lax" | "strict" | "none" | undefined,
      maxAge: number
    }
  },
  readonly superadmin: {
    readonly password: string,
    readonly email: string
  }
}

interface DatabaseConfig {
  readonly credentials: {
    readonly connectionString: string
  },
  options: {
    useNewUrlParser: boolean,
    useUnifiedTopology: boolean,
    ignoreUndefined: boolean,
    keepAlive: boolean
  }
}

interface ProductConfig {
  readonly variant: {
    readonly icon: {
      destination: string
      readonly maximumSize: number
    }
  }
  readonly tag: {
    readonly icon: {
      destination: string
      readonly maximumSize: number
    }
  }
  readonly image: {
    readonly maximum: number
    readonly file: {
      destination: string
      readonly allowedTypes: string[]
      readonly maximumSize: number
    }
  }
}

interface OrderConfig {
  discount: {
    withoutDelivery: number,
    weekday: number
  }
}

export class ConfigEntity {
  public configInfo: {
    usedOverrideFilePath?: string,
    usedEnv: string[]
  }
  public readonly production: boolean
  public readonly pkgJson: PkgJson
  public readonly paths: ConfigPaths
  public readonly server: ConfigServer
  public readonly logger: LoggerConfig
  public readonly user: UserConfig
  public readonly database: DatabaseConfig
  public readonly product: ProductConfig
  public readonly order: OrderConfig
  public readonly _: {
    onSuccessful: 'onResponse' | 'onSend'
  }

  constructor(defaultConfig: ConfigEntity) {
    this.configInfo = defaultConfig.configInfo
    this.production = defaultConfig.production
    this.pkgJson = defaultConfig.pkgJson
    this.server = defaultConfig.server
    this.logger = defaultConfig.logger
    this.user = defaultConfig.user
    this.database = defaultConfig.database
    this.product = defaultConfig.product
    this.order = defaultConfig.order
    this._ = defaultConfig._

    const rootDir = path.resolve(__dirname, '../../../')

    if (!this.product.image.file.destination) {
      this.product.image.file.destination = path.resolve(rootDir, 'image/product')
    }
    if (!this.product.variant.icon.destination) {
      this.product.variant.icon.destination = path.resolve(rootDir, 'image/variant-icon')
    }
    if (!this.product.tag.icon.destination) {
      this.product.tag.icon.destination = path.resolve(rootDir, 'image/tag')
    }

    this.paths = {
      root: rootDir,
      shareStatic: path.resolve(rootDir, 'static/share')
    }
  }

  useLogger(logger: Logger) {
    logger = logger.child({label: 'config'})
    if (this.configInfo.usedOverrideFilePath) {
      logger.info(`Use override config file ${this.configInfo.usedOverrideFilePath}`)
    }
    this.configInfo.usedEnv.forEach(env => logger.info(`Used env ${env}`))

    if (this.production) {
      if (this.logger.pretty) {
        logger.warn(`You have set "logger.pretty" to "true", the recommended value in "production" mode is "false" to improve performance`)
      }
      if (this.logger.isoTime) {
        logger.warn(`You have set "logger.isoTime" to "true", the recommended value in "production" mode is "false" to improve performance`)
      }
    }
  }
}