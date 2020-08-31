// ...rest of the initial code omitted for simplicity.
const { body, validationResult } = require('express-validator');

app.post(
  '/user',
  [
    // username must be an email
    body('username').isEmail(),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5 }),
  ],
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
      username: req.body.username,
      password: req.body.password,
    }).then((user) => res.json(user));
  }
);

// SANITIZATION

const app = express();
app.use(express.json());

app.post(
  '/comment',
  [
    body('email').isEmail().normalizeEmail(),
    body('text').not().isEmpty().trim().escape(),
    body('notifyOnReply').toBoolean(),
  ],
  (req, res) => {
    // Handle the request somehow
  }
);

// WITH ERROR MESSAGES

const { check } = require('express-validator');

app.post(
  '/user',
  [
    // ...some other validations...
    check('password')
      .isLength({ min: 5 })
      .withMessage('must be at least 5 chars long')
      .matches(/\d/)
      .withMessage('must contain a number'),
  ],
  (req, res) => {
    // Handle the request somehow
  }
);

// CUSTOM VALIDATION

const { check } = require('express-validator');

app.post(
  '/user',
  [
    check('email').custom((value) => {
      return User.findByEmail(value).then((user) => {
        if (user) {
          return Promise.reject('E-mail already in use');
        }
      });
    }),
    check('password').custom((value, { req }) => {
      if (value !== req.body.passwordConfirmation) {
        throw new Error('Password confirmation is incorrect');
      }
    }),
  ],
  (req, res) => {
    // Handle the request somehow
  }
);
