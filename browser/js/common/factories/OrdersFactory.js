app.factory('OrdersFactory', function ($http, $q) {
  var orderStatus = [];
  return {
    getOrders: function () {
      return $http.get('/api/v1/orders')
      .then(function (res) {
        return res.data;
      });
    },

    fetchOrder: function(id){
      return $http.get('/api/v1/order/' + id)
      .then(function(order){
        return order.data;
      })
    },

    submitPayment: function(response, total) {
      return $http.post('/api/v1/order', {response: response, total: total})
      .then(function(response) {
        return response.data;
      })
      .catch(function () {
                return $q.reject({ message: 'Stripe Card Error' });
            });
    },

    updateOrder: function (order) {
      return $http.put('api/v1/orders/' + order.id, order)
    },

    deleteOrder: function (id) {
      return $http.delete('api/v1/order/' + id);
    },

    markAsShipped: function (id) {
      return $http.put('api/v1/order/' + id + '/shipped')
      .then(function(response) {
        return response.data;
      });
    },

    markAsDelivered: function (id) {
      return $http.put('api/v1/order/' + id + '/delivered')
      .then(function(response) {
        return response.data;
      });
    }
  };
});
