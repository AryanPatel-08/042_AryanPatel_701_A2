const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));


// Storage configuration for multer
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profile');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-profile' + path.extname(file.originalname));
    }
});

const othersStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/others');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-other' + path.extname(file.originalname));
    }
});

const profileUpload = multer({ storage: profileStorage });
const othersUpload = multer({ storage: othersStorage });

const upload = multer();

const cpUpload = multer().fields([
    { name: 'profile_pic', maxCount: 1 },
    { name: 'other_pics', maxCount: 5 }
]);

app.get('/', (req, res) => {
    res.render('form', { errors: {}, data: {} });
});

app.post('/register',
    multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                if (file.fieldname === 'profile_pic') {
                    cb(null, 'uploads/profile');
                } else {
                    cb(null, 'uploads/others');
                }
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + '-' + file.originalname);
            }
        }),
        fileFilter: (req, file, cb) => {
            const allowed = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!allowed.includes(file.mimetype)) {
                return cb(null, false);
            }
            cb(null, true);
        }
    }).fields([
        { name: 'profile_pic', maxCount: 1 },
        { name: 'other_pics', maxCount: 5 }
    ]),
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters'),
        body('confirm_password').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
        body('gender').notEmpty().withMessage('Gender is required'),
        body('hobbies').notEmpty().withMessage('Select at least one hobby')
    ],
    (req, res) => {
        const errors = validationResult(req);
        const uploadedFiles = {
            profile: req.files['profile_pic'] ? req.files['profile_pic'][0].filename : '',
            others: req.files['other_pics'] ? req.files['other_pics'].map(f => f.filename) : []
        };

        if (!errors.isEmpty()) {
            return res.render('form', {
                errors: errors.mapped(),
                data: { ...req.body }
            });
        }

        // Store user data in a file
        const output = `
            Username: ${req.body.username}
            Email: ${req.body.email}
            Gender: ${req.body.gender}
            Hobbies: ${Array.isArray(req.body.hobbies) ? req.body.hobbies.join(', ') : req.body.hobbies}
        `;
        const filePath = `downloads/${Date.now()}-user-info.txt`;
        fs.writeFileSync(filePath, output);

        res.render('result', {
            data: req.body,
            files: uploadedFiles,
            downloadPath: '/' + filePath
        });
    });

app.get('/download/:filename', (req, res) => {
    const file = path.join(__dirname, 'downloads', req.params.filename);
    res.download(file);
});

app.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});
