import { dbInstance as db } from '..';
import { loggerInstance as logger } from '../../logger';

export const createLikeTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS
      "Likes" (
        id varchar(128) PRIMARY KEY NOT NULL,
        users TEXT,
        likes INTEGER DEFAULT 0,
        "reviewId" varchar(128),
        "replyId" varchar(128),
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deletedAt" TIMESTAMP
      );
  `;

  const queryConfig = {
    text: query,
  };

  try {
    await db.query(queryConfig);
  } catch (error) {
    logger.info(error);
  }
};

export const dropLikeTable = async () => {
  const query = `
    DROP TABLE IF EXISTS "Likes";
  `;

  const queryConfig = {
    text: query,
  };

  try {
    await db.query(queryConfig);
  } catch (error) {
    logger.info(error);
  }
};
