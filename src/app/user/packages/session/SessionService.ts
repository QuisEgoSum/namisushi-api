import {BaseService} from '@core/service'
import {ISession} from './SessionModel'
import {SessionRepository} from './SessionRepository'
import {Types} from 'mongoose'


export class SessionService extends BaseService<ISession, SessionRepository> {
  constructor(sessionRepository: SessionRepository) {
    super(sessionRepository)
  }

  async createForUser(userId: string | Types.ObjectId) {
    userId = new Types.ObjectId(userId)

    const session = await this.repository.create({user: userId})

    const extraSessionsIds = await this.repository.findExtraSessions(userId)

    if (extraSessionsIds.length) {
      await this.repository.deleteSessionsByIds(extraSessionsIds)
    }

    return session
  }

  async findSessionById(sessionId: string) {
    return this.repository.findUserBySessionIdAndUpdate(sessionId)
  }

  async deleteUserSession(userId: string | Types.ObjectId, sessionId: string) {
    return this.repository.deleteOne({_id: sessionId, user: new Types.ObjectId(userId)})
  }

  async deleteUserSessionsExpect(userId: string | Types.ObjectId, sessionId: string) {
    return this.repository.deleteMany({user: new Types.ObjectId(userId), _id: {$ne: sessionId}})
  }
}