'use strict';

const path = require('path');
const router = require('express').Router();
const db = require(path.join(__dirname, '../../../db'));
const User = db.model('user');



router.post('/', function (req, res, next) {
    User.findOrCreate({where:
      {
        email: req.body.email,
        isGuest: true
      }
    })
    .spread(function(user, createdUser) {
      req.session.guest = user;
      res.send({user: user, id: req.sessionID});
    })
    .catch(next);
});

// router.get('/:id', function (req, res, next) {
//   res.send(req.song);
// });

// router.delete('/:id', function (req, res, next) {
//   if (req.user) {
//     if (req.user.isAdmin) {
//       req.song.destroy()
//       .then(function () {
//         res.sendStatus(204);
//       })
//       .catch(next);
//     } else {
//       res.sendStatus(403);
//     }
//    } else {
//     res.sendStatus(401);
//   }
// });

// router.put('/:id', function (req, res, next) {
//   if (req.user) {
//     if (req.user.isAdmin) {
//       req.song.update(req.body)
//       .then(function () {
//         res.sendStatus(200);
//       })
//       .catch(next);
//     } else {
//       res.sendStatus(403);
//     }
//    } else {
//     res.sendStatus(401);
//   }
// });



module.exports = router;