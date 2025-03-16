const express = require("express");
const app = express();
const winston = require('winston');
/* express - imports the express framework
winston - imports the winston library for logging */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'add-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
/* level - sets the logging level(info and error)
    format - logs in JSON format for easier parsing
    transports - configures output to files:
            error.log - logs only errors
            combined.log - logs all messages
    console transport - logs to the console in non-production environments */

const add = (n1, n2) => n1 + n2;
/* A simple function that takes two parameters and returns their sum */

app.get("/add", (req, res) => {
    try {
        const n1 = parseFloat(req.query.n1);
        const n2 = parseFloat(req.query.n2);

        if (isNaN(n1)) {
            logger.error("n1 is incorrectly defined");
            throw new Error("n1 incorrectly defined");
        }
        if (isNaN(n2)) {
            logger.error("n2 is incorrectly defined");
            throw new Error("n2 incorrectly defined");
        }

        logger.info(`Parameters ${n1} and ${n2} received for addition`);
        const result = add(n1, n2);
        res.status(200).json({ statuscode: 200, data: result });
    } catch (error) {
        logger.error(error.toString());
        res.status(500).json({ statuscode: 500, msg: error.toString() });
    }
});
/* n1 - first number
    n2- second number

    validation - if n1 or n2 are not numbers, an error is logged and a 500 status is returned
    Addition - If valid, the two numbers are added and the result is logged and returned
    */

const port = 3040;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
/* The server listens on port 3040. Upon Startup, a message is displayed in the console */
/* This microservice is designed to accept two numeric parameters, validate the input, perform addition, return JSON responses and log activity and errors using winston */
