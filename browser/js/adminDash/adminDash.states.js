
/**
* @memberof states
* @namespace adminDash
*/

/**
 * @memberof states
 * @namespace forms
 */


app.config(function ($stateProvider) {
  /**
   * @memberof states.adminDash
   * @name adminDash
   * @type state
   */
  $stateProvider.state('adminDash', {
    url: '/adminDash',
    templateUrl: 'js/adminDash/adminDash.html'
  })
/**
 *  @name songs
 *  @type state
 *  @memberof states.adminDash
 */
  .state('adminDash.songs', {
    url: '/songs',
    templateUrl: 'js/adminDash/song/adminDash.songs.html',
    controller: 'adminDashSongsCtrl'
  })
  /**
   *  @name songForm
   *  @type state
   *  @memberof states.forms
   */
  .state('songForm', {
    url: '/songForm/:id',
    templateUrl: 'js/adminDash/song/adminDash.songForm.html',
    controller: 'songFormCtrl'
  })
  /**
   *  @name users
   *  @type state
   *  @memberof states.adminDash
   */
  .state('adminDash.users', {
    url: '/users',
    templateUrl: 'js/adminDash/users/adminDash.users.html',
    controller: 'adminDashUsersCtrl'
  })

  /**
   *  @name userForm
   *  @type state
   *  @memberof states.forms
   */
  .state('userForm', {
    url: '/userForm/:id',
    templateUrl: 'js/adminDash/users/adminDash.userForm.html',
    controller: 'userFormCtrl'
  })

  /**
   *  @name orders
   *  @type state
   *  @memberof states.adminDash
   */
  .state('adminDash.orders', {
    url: '/orders',
    templateUrl: 'js/adminDash/orders/adminDash.orders.html',
    controller: 'adminDashOrdersCtrl'
  })

  /**
   *  @name orderForm
   *  @type state
   *  @memberof states.forms
   */
  .state('orderForm', {
    url: '/orderForm/:id',
    templateUrl: 'js/adminDash/orders/adminDash.orderForm.html',
    controller: 'orderFormCtrl'
  });
});
