import {SessionModel} from './SessionModel'
import {SessionRepository} from './SessionRepository'
import {SessionService} from './SessionService'


class Session {
  public service: SessionService

  constructor(sessionService: SessionService) {
    this.service = sessionService
  }
}

export async function initSession(): Promise<Session> {
  return new Session(new SessionService(new SessionRepository(SessionModel)))
}

export type {
  Session
}