import { dbQuery } from '..';
import logger from '../../utils/initLogger';

export const createReplyTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS
      "Replies" (
        id varchar(128) PRIMARY KEY NOT NULL,
        reply TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        "reviewId" varchar(128) REFERENCES "Reviews"(id),
        "userId" varchar(128) REFERENCES "Users"(id),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
  `;

  const queryConfig = {
    text: query,
  };

  try {
    await dbQuery(queryConfig);
  } catch (error) {
    logger.info(error);
  }
};

export const dropReplyTable = async () => {
  const query = `
    DROP TABLE IF EXISTS "Replies";
  `;

  const queryConfig = {
    text: query,
  };

  try {
    await dbQuery(queryConfig);
  } catch (error) {
    logger.info(error);
  }
};