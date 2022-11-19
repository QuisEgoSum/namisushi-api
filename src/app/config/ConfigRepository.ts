import {BaseRepository} from '@core/repository'
import {IConfig} from '@app/config/ConfigModel'


export class ConfigRepository extends BaseRepository<IConfig> {
  async upsert() {
    await this.Model.updateOne(
      {__id: 1},
      {$setOnInsert: {
          theme: null,
          infoMessage: null,
          infoMessageEnabled: false,
          globalDiscountPercent: 0,
          globalDiscountEnabled: false
        }},
      {upsert: true}
    )
  }
}