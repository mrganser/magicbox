//Recaptcha v3
$(function () {
  grecaptcha.ready(function () {
    grecaptcha.execute('6Lds6pkUAAAAANu3r3ELICpYU-UHOGbEu5SuNI3t', { action: 'newchannel' }).then(function (token) {
      document.getElementById('g-recaptcha-response').value = token;
    });
  });
});
