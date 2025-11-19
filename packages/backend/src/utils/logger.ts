import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, json, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        json()
    ),
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error-%DATE%.log`
        // - Write all logs with importance level of `info` or less to `combined-%DATE%.log`
        //
        new winston.transports.DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
        }),
        new winston.transports.DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: combine(colorize(), logFormat),
        })
    );
}
