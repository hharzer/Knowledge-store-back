import { createLogger } from 'info-logger';
import { LOG_FOLDER_NAME, LOG_FILE_NAME } from '../settings';

const logger = createLogger(LOG_FOLDER_NAME, LOG_FILE_NAME);

export default logger;
