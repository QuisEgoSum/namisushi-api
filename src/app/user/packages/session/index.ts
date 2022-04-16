import {SessionModel} from './SessionModel'
import {SessionRepository} from './SessionRepository'
import {SessionService} from './SessionService'


class Session {
  constructor(
    public readonly service: SessionService
  ) {}
}


export async function initSession(): Promise<Session> {
  return new Session(new SessionService(new SessionRepository(SessionModel)))
}


export type {
  Session,
  SessionService
}