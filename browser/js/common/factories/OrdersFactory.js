app.factory('OrdersFactory', function ($http) {
  return {
    getOrders: function () {
      return $http.get('/api/v1/orders')
      .then(function (res) {
        return res.data;
      });
    },

    getUserOrders: function(id){
      return $http.get('/api/v1/orders/userOrders/' + id)
      .then(function(res){
        return res.data;
      });
    },

    fetchOrder: function(id){
      return $http.get('/api/v1/orders/' + id)
      .then(function(order){
        return order.data;
      })
    },

    createOrUpdateOrder: function (order) {
      if(order.id) {
        return $http.get('api/v1/orders/' + order.id)
          .then(function (response) {
            let foundOrder = response.data;
              return $http.put('api/v1/orders/' + foundOrder.id, order);
          });
        } else {
          delete order.id;
          return $http.post('api/v1/orders/', order);
        }
    },

    deleteOrder: function (id) {
      return $http.delete('api/v1/orders/' + id);
    }
  };
});
