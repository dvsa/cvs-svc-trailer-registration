"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = async (event = {}) => {
    console.log('Hello trailer v1.0.5!');
    const response = JSON.stringify(event, null, 2);
    return response;
};

