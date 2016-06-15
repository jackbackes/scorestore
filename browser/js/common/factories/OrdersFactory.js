app.factory('OrdersFactory', function ($http, $q, EmailFactory) {

  var errorFunc = function(error) {
      return $q.reject(error.statusText);
  };

  var successFunc = function(response) {
    return response.data;
  };

  return {
    getOrders: function () {
      return $http.get('/api/v1/orders')
      .then(successFunc)
      .catch(errorFunc);
    },

    getUserOrders: function(id){
      return $http.get('/api/v1/orders/userOrders/' + id)
      .then(function(res){
        return res.data;
      });
    },

    fetchOrder: function(id){
      return $http.get('/api/v1/order/' + id)
      .then(successFunc)
      .catch(errorFunc);
    },

    submitPayment: function(response, total) {
      return $http.post('/api/v1/order', {response: response, total: total})
      .then(function (res) {
        EmailFactory.sendConfirmation(res.data.confirmationNumber);
      })
      .catch(function () {
          return $q.reject({ message: 'Stripe Card Error' });
      });
    },

    updateOrder: function (order) {
      return $http.put('api/v1/orders/' + order.id, order)
      .then(successFunc)
      .catch(errorFunc);
    },

    deleteOrder: function (id) {
      return $http.delete('api/v1/order/' + id)
      .then(successFunc)
      .catch(errorFunc);
    },

    markAsShipped: function (id) {
      return $http.put('api/v1/order/' + id + '/status', {status: 'Processing', shipped: true})
      .then(successFunc)
      .catch(errorFunc);
    },

    markAsCancelled: function (id) {
      return $http.put('api/v1/order/' + id + '/status', {status: 'Cancelled'})
      .then(successFunc)
      .catch(errorFunc);
    },

    markAsDelivered: function (id) {
      let date = new Date();
      return $http.put('api/v1/order/' + id + '/status', {status: 'Completed', deliveredAt: date})
      .then(successFunc)
      .catch(errorFunc);
    }
  };
});
