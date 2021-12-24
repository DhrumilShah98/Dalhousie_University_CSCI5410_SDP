/* Author: Dhrumil Amish Shah (B00857606) */
const express = require('express');
const pubSubMessagingController = require('../controllers/pubSubMessagingController');
const imageUploadUtil = require('../utils/imageUploadUtil');
const pubSubMessagingRoutes = express.Router();

pubSubMessagingRoutes.post('/chat/topic', async (req, res, next) => {
    const controllerResponse = await pubSubMessagingController.createTopic(req.body.userId, req.body.email);
    return res.status(controllerResponse.statusCode).json(controllerResponse);
});

pubSubMessagingRoutes.post('/chat/publishMessage', async (req, res, next) => {
    const controllerResponse = await pubSubMessagingController.publishMessage(req.body.topicName, req.body.message);
    return res.status(controllerResponse.statusCode).json(controllerResponse);
});

pubSubMessagingRoutes.get('/chat/pullDelivery', async (req, res, next) => {
    const controllerResponse = await pubSubMessagingController.pullDelivery(req.query.topicName, req.query.userId);
    return res.status(controllerResponse.statusCode).json(controllerResponse);
});

pubSubMessagingRoutes.post('/uploadImage', imageUploadUtil.single('imageLocation'), async (req, res, next) => {
    const controllerResponse = await pubSubMessagingController.uploadImage(req.file, req.body.userId);
    return res.status(controllerResponse.statusCode).json(controllerResponse);
});

module.exports = pubSubMessagingRoutes;