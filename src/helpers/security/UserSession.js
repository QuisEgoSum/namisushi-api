const {ENUM: USER_ENUM} = require('core/user')


class UserSession {

    /**
     * @param {UserSessionExpand} session
     */
    constructor(session) {
        this.sessionId = session._id
        this.userId = session.user._id
        this.role = session.user.role
    }

    isAdmin() {
        return this.role === USER_ENUM.USER_ROLE.ADMIN
    }
}


module.exports = UserSession