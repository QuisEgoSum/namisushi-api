import {Types} from 'mongoose'
import {UserRole} from '@app/user/UserRole'


export class UserSession {
  constructor(
    public readonly sessionId: string,
    public readonly userId: Types.ObjectId,
    public readonly userRole: UserRole) {
  }

  isAdmin(): boolean {
    return this.userRole === UserRole.ADMIN || this.userRole === UserRole.WATCHER
  }
}