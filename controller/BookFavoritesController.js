import { stackLogger } from 'info-logger';
// import models from '../models';
import utils from '../utils';
import BookController from './BookController';
import { retrieveBook } from '../elasticSearch';
import {
  ADDED_TO_FAVORITE, BOOK_REMOVED_FROM_FAVORITES
} from '../settings/default';
import authStatusCheck from '../utils/authStatusCheck';
import FavoritesRepository from '../repository/Favorite';

const { helper } = utils;
const favoritesRepository = new FavoritesRepository();

class BookFavoritesController {
  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof BookFavoritesController
   */
  static async addToFavorites(data, authStatus) {
    const newData = data;
    try {
      authStatusCheck(authStatus);
      const retrievedBook = await retrieveBook(newData.bookId);
      await BookController.addBookIfNotExist(retrievedBook, newData.bookId);
      newData.id = helper.generateId();
      newData.userId = authStatus.id;
      // const favorite = await models.Favorite.findOne({
      //   where: {
      //     bookId: newData.bookId,
      //     userId: authStatus.id,
      //   }
      // });
      const queryObject = {
        bookId: newData.bookId,
        userId: authStatus.id,
      };
      const favorite = await favoritesRepository.findOne(queryObject);
      if (favorite) {
        // await favorite.destroy();
        await favoritesRepository.deleteOne(queryObject);

        return {
          message: BOOK_REMOVED_FROM_FAVORITES,
        };
      }
      await favoritesRepository.create(newData);
      // await models.Favorite.create(newData);
      return {
        message: ADDED_TO_FAVORITE
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} bookId
   * @returns
   * @memberof BookFavoritesController
   */
  static async checkFavorite(bookId, authStatus) {
    try {
      if (!authStatus) {
        return false;
      }
      const { id } = authStatus;
      // const favorite = await models.Favorite.findOne({
      //   where: {
      //     bookId,
      //     userId: id,
      //   }
      // });
      const queryObject = {
        bookId,
        userId: id,
      };
      const favorite = await favoritesRepository.findOne(queryObject);

      if (favorite) return true;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} authStatus
   * @returns
   * @memberof BookFavoritesController
   */
  static async getFavorites(authStatus) {
    try {
      authStatusCheck(authStatus);
      const { id } = authStatus;
      // const books = await models.Favorite.findAll({
      //   where: {
      //     userId: id
      //   },
      //   include: [{
      //     model: models.Book,
      //     as: FAVORITE_BOOK_LABEL,
      //   }]
      // }).map((value) => {
      //   value.get({ plain: true });
      //   return value.favoriteBook;
      // });
      const books = await favoritesRepository.getFavoriteBooks({
        userId: id,
      });
      if (!books.length) return [];
      return books;
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof BookFavoritesController
   */
  static async removeFavorites(data, authStatus) {
    const { books } = data;
    try {
      authStatusCheck(authStatus);
      const { id } = authStatus;
      // await models.Favorite.destroy({
      //   where: {
      //     userId: id,
      //     bookId: books,
      //   },
      // });

      await favoritesRepository.deleteMany({
        userId: id,
      }, { bookId: books, });

      return {
        message: BOOK_REMOVED_FROM_FAVORITES
      };
    } catch (error) {
      stackLogger(error);
      return error;
    }
  }
}

export default BookFavoritesController;
