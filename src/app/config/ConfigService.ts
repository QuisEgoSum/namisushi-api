import {BaseService} from '@core/service'
import {IConfig} from '@app/config/ConfigModel'
import {ConfigRepository} from '@app/config/ConfigRepository'


export class ConfigService extends BaseService<IConfig, ConfigRepository> {
  async upsert() {
    await this.repository.upsert()
  }
}