import {BaseRepository} from '@core/repository'
import type {ISession, SessionModel} from './SessionModel'
import {Types} from 'mongoose'
import {config} from '@config'
import type {UserRole} from '@app/user/UserRole'
import type {IUser} from '@app/user/UserModel'


export class SessionRepository extends BaseRepository<ISession> {

  private static readonly maximumUserSessions = config.user.session.maximum

  constructor(Model: typeof SessionModel) {
    super(Model)
  }

  async findExtraSessions(userId: Types.ObjectId): Promise<string[] | []> {
    return this.Model
      .find({user: userId})
      .sort({createdAt: -1})
      .skip(SessionRepository.maximumUserSessions)
      .select({_id: 1})
      .lean()
      .exec()
      .then(sessions => sessions.map(session => session._id))
  }

  async deleteSessionsByIds(sessionIds: string[]) {
    return this.Model
      .deleteMany({$in: sessionIds})
  }

  findUserBySessionIdAndUpdate(sessionId: string): Promise<{_id: string, user: {_id: Types.ObjectId, role: UserRole}} | null> {
    return this.Model
      .findByIdAndUpdate(sessionId, {updatedAt: Date.now()})
      .select({_id: 1, user: 1})
      .lean()
      .populate<{user: IUser}>('user', {_id: 1, role: 1}, 'User')
      .exec()
  }
}