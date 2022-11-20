import {config} from '@config'
import os from 'os'


export class NotificationMessageUtils {

  private static formatLogObject(s: string, o: object): string[] {
    if (s) {
      s += '.'
    }
    const result = []
    for (const [key, value] of Object.entries(o)) {
      if (typeof value === 'object' && value !== null) {
        result.push(...NotificationMessageUtils.formatLogObject(s + key, value))
      } else {
        result.push(s + key + ': ' + value)
      }
    }
    return result
  }

  public static parseLog(level: 'ERROR' | 'FATAL', log: string): string[] {
    return [`*${level} NOTIFICATION*\n`, '```', ...NotificationMessageUtils.formatLogObject('', JSON.parse(log)), '```']
  }

  public static getStartMessage(): string[] {
    return [
      'APPLICATION STARTED\n',
      `Version ${config.pkgJson.version}\n\n`,
      `Local networks:\n`,
      ` - http: 127.0.0.1:${config.server.http.port}\n`,
      ` - ws: 127.0.0.1:${config.server.ws.port}\n`,
      ` - telegram: ${
          config.server.telegram.enableWebhook
            ? `127.0.0.1:${config.server.telegram.webhook.port}`
            : 'Long polling'
      }\n\n`,
      `Public addresses: \n- user: ${config.server.address.user}\n- admin: ${config.server.address.admin}\n- api: ${config.server.address.api}\n\n`,
      `OS:\n`,
      `- hostname: ${os.hostname()}\n`,
      `- platform: ${os.platform()}\n`,
      `- release: ${os.release()}\n`,
      `- version: ${os.version()}\n`,
      `- cpus ${os.cpus().length} ${os.cpus()[0].model}\n`,
      `- arch: ${os.arch()}\n`,
      `- homedir: ${os.homedir()}\n`,
      (os.networkInterfaces().eth0?.[0]?.address
        ? `- public network: ${os.networkInterfaces().eth0?.[0]?.address}\n`
        : ''),
      `- memory:\n`,
      ` - total: ${os.totalmem()}\n`,
      ` - free: ${os.freemem()}\n`,
      `- load ${os.loadavg().join('|')}\n\n`,
      `timestamp: ${new Date().toUTCString()}`
    ]
  }

  static getShutdownMessage(event: string) {
    return [`*APPLICATION SHUTDOWN*\n\n`, `event: ${event}\n\n`, `timestamp: ${new Date().toUTCString()}`]
  }
}