

declare module 'greensms' {
  enum APIVersion {
    V1 = "V1",
  }

  /**
   * @summary Initialize GreenSMS Client Options
   */
  export interface GreenSMSOptions {
    /**
     * @summary Username. Required when AuthToken is not passed
     */
    user?: string | null
    /**
     * @summary Password. Request when AuthToken is not passed
     */
    pass?: string | null
    /**
     * @summary AuthToken. Required when Username/Password not passed
     */
    token?: string | null
    /**
     * @summary Create Auth Token after login and use for subsequent requests
     */
    useTokenForRequests?: boolean
    /**
     * @summary API Version to be used
     */
    version?: APIVersion
  }

  export interface GreenSMSRequestConfig {
    username?: string
    password?: string
    token?: string
    useTokenForRequests?: boolean
    version?: APIVersion
    // camelCaseResponse?: boolean
  }

  export declare class GreenSMS {
    /**
     * Creates a GreenSMS Client Object
     * @constructor
     * @param {GreenSMSOptions} GreenSMSOptions
     */
    constructor(GreenSMSOptions)
  }
}