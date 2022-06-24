import {EntityDoesNotExistError, InvalidDataError, TooEarlyError} from '@error'


export const OtpCodeDoesNotExistError = EntityDoesNotExistError.extends(
  {},
  {
    error: 'OtpCodeDoesNotExistError',
    message: 'Код не найден',
    code: 8000
  }
)

export const OtpCodeHasExpiredError = InvalidDataError.extends(
  {},
  {
    error: 'OtpCodeHasExpiredError',
    message: 'Время жизни кода истекло',
    code: 8001
  }
)

export const OtpCodeHasAlreadyBeenUsedError = InvalidDataError.extends(
  {},
  {
    error: 'OtpCodeHasAlreadyBeenUsedError',
    message: 'Код уже был использован',
    code: 8002
  }
)

export const SendOtpTimeoutError = TooEarlyError.extends(
  {},
  {
    error: 'SendOtpTimeoutError',
    message: 'Интервал между отправкой сообщений должен быть 60 секунд. Подождите ещё {number} {secondDeclination}',
    code: 8003
  }
)

export const SendOtpDayLimitError = TooEarlyError.extends(
  {},
  {
    error: 'SendOtpDayLimitError',
    message: 'Сервис отправки сообщений временно не доступен',
    code: 8004
  }
)

export const SendOtpPhoneDayLimitError = TooEarlyError.extends(
  {},
  {
    error: 'SendOtpPhoneDayLimitError',
    message: 'Превышено максимальное суточное число попыток отправить код по данному номеру',
    code: 8005
  }
)