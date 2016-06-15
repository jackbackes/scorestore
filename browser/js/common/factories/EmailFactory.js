app.factory('EmailFactory', function ($http) {
  return {
    sendConfirmation: function (confirmationNumber) {
      $http.put('/api/v1/emails/confirmation', {confirmationNumber: confirmationNumber});
    },

    // sendShipped: function () {
      //implement if time
    // },

    // sendDelivered: function () {
      //implement if time
    // }
  };
});