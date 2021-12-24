/* Author: Dhrumil Amish Shah (B00857606) */
import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

export const createTopic = (userData) => {
    return axios({
        method: "POST",
        url: `${BASE_URL}/pubsubmessage/chat/topic`,
        data: userData,
        headers: { "Content-Type": "application/json" },
    });
};

export const publishMessage = (userData) => {
    return axios({
        method: "POST",
        url: `${BASE_URL}/pubsubmessage/chat/publishMessage`,
        data: userData,
        headers: { "Content-Type": "application/json" },
    });
};

export const pullDelivery = (userData) => {
    return axios({
        method: "GET",
        url: `${BASE_URL}/pubsubmessage/chat/pullDelivery?topicName=${userData.topicName}&userId=${userData.userId}`,
    });
};

export const uploadImage = (imageData) => {
    return axios({
        method: "POST",
        url: `${BASE_URL}/pubsubmessage/uploadImage`,
        data: imageData,
        headers: { "Content-Type": "multipart/form-data" },
    });
};