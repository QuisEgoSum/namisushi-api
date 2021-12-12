
/**
 * @typedef {HttpRequest & {session: UserSession}} AuthorizedRequest
 */

/**
 * @typedef {HttpRequest & {session?: UserSession}} OptionalAuthorizedRequest
 */

/**
 * @typedef {AuthorizedRequest & {cookies: String}} AuthorizeRequest
 */