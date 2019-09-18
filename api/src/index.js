import http from 'http';
import cors from 'cors';
import multer from 'multer';
import express from 'express';
import { resolve, join } from 'path';
import { Sequelize } from 'sequelize';

import PhotoModel from './photo.model';

const config = {
    port: 3001,
    uploadDir: `${resolve(__dirname, '..')}/uploads/`,
    database: {
        username: "root",
        password: "admin",
        host: "localhost",
        port: "3306",
        dialect: "mysql",
        database: "photato",
    }
};

let app = express();
app.server = http.createServer(app);

// 3rd party middlewares
app.use(cors({}));

// connect to db
const database = new Sequelize(config.database);

// initialize models
const Photo = PhotoModel.init(database);

// setup multer
const uploadMiddleware = multer({ 
    dest: config.uploadDir,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
    },
}).single('photo');

database.sync().then(() => {
    app.get('/', (req, res) => {
        res.json({app: 'photato'});
    });

    app.get("/photo/:filename", (req, res) => {
        res.sendFile(join(config.uploadDir, `/${req.params.filename}`));
    });

    app.get('/photo', async (req, res) => {
        const photos = await Photo.findAndCountAll();
        res.json({success: true, photos});
    });

    app.post('/photo', uploadMiddleware, async (req, res) => {
        try {
            const photo = await Photo.create(req.file);
            res.json({success: true, photo});
        } catch (err) {
            res.status(400).json({success: false, message: err.message});
        }
    });

    app.server.listen(process.env.PORT || config.port, () => {
        console.log(`Started on port ${app.server.address().port}`);
    });
});

export default app;