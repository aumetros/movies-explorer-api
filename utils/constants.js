/** Регулярные выражения для валидации данных */
const linkReg = /https*:\/\/[a-zA-Z0-9\-\._~:\/?#\[\]@!$&'\(\)*\+,;=]+\.[a-zA-Z0-9\-\._~:\/?#\[\]@!$&'\(\)*\+,;=]+#*/;
const emailReg = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;

/** Сообщения об ошибках */
const invalidUserDataMsg = 'Переданы некорректные данные пользователя.';
const existEmailMsg = 'Пользователь с таким email уже зарегистрирован.';
const invalidLoginData = 'Неправильные почта или пароль.';
const userNotFoundMsg = 'Пользователь не найден.';
const invalidMovieDataMsg = 'Переданы некорректные данные фильма.';
const movieNotFoundMsg = 'Фильм не найден.';
const forbiddenErrorMsg = 'У вас нет прав на этой действие.';
const authErrorMsg = 'Необходима авторизация';

module.exports = {
  linkReg,
  emailReg,
  invalidUserDataMsg,
  existEmailMsg,
  invalidLoginData,
  userNotFoundMsg,
  invalidMovieDataMsg,
  movieNotFoundMsg,
  forbiddenErrorMsg,
  authErrorMsg,
};
