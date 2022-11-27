import {BaseService} from '@core/service'
import {INews} from '@app/news/NewsModel'
import {NewsRepository} from '@app/news/NewsRepository'


export class NewsService extends BaseService<INews, NewsRepository> {}