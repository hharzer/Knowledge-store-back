// import models from '../models';
import utils from '../utils';
import {
  NO_REPLY, /* USER_QUERY_ATTRIBUTES, REPLIER_LABEL, */
} from '../settings/default';
import authStatusCheck from '../utils/authStatusCheck';
import ReplyRepository from '../repository/Reply';
import ReviewRepository from '../repository/Review';

const { helper, validator } = utils;

const replyRepository = new ReplyRepository();
const reviewRepository = new ReviewRepository();

class ReplyController {
  /**
   *
   *
   * @static
   * @param {*} data
   * @param {*} authStatus
   * @returns
   * @memberof ReplyController
   */
  static async addReply(data, authStatus) {
    const newData = data;
    const errors = validator.validateAddReply({
      ...newData
    });
    try {
      authStatusCheck(authStatus);
      // const review = await models.Review.findOne({
      //   where: {
      //     id: newData.reviewId
      //   }
      // });

      const review = await reviewRepository.findOne({
        id: newData.reviewId,
      });

      newData.id = helper.generateId();
      newData.userId = authStatus.id;
      if (Object.keys(errors).length !== 0) {
        throw new Error(JSON.stringify(errors));
      }

      return review && await replyRepository.create(newData);

      // return review && await models.Reply.create(newData);
    } catch (error) {
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
   * @memberof ReplyController
   */
  static async editReply(data, authStatus) {
    const newData = data;
    try {
      authStatusCheck(authStatus);
      // const editedReply = await models.Reply.update(
      //   { reply: newData.reply },
      //   {
      //     returning: true,
      //     where: {
      //       id: newData.replyId,
      //       userId: authStatus.id
      //     }
      //   }
      // );

      const editedReply = await replyRepository.updateOne({
        id: newData.replyId,
        userId: authStatus.id
      }, {
        reply: newData.reply
      });

      if (!editedReply || !editedReply.id) throw new Error(NO_REPLY);
      return editedReply;
    } catch (error) {
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
   * @memberof ReplyController
   */
  static async deleteReply(data, authStatus) {
    const { replyId } = data;
    try {
      authStatusCheck(authStatus);
      // const deletedReply = await models.Reply.destroy(
      //   {
      //     returning: true,
      //     where: {
      //       id: replyId,
      //       userId: authStatus.id
      //     }
      //   }
      // );

      const deletedReply = await replyRepository.deleteOne({
        id: replyId,
        userId: authStatus.id,
      });

      if (!deletedReply) throw new Error(NO_REPLY);
      return deletedReply;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} reviewId
   * @returns
   * @memberof ReplyController
   */
  static async getReview(reviewId) {
    try {
      return await reviewRepository.findOne({
        reviewId
      });

      // return await models.Review.findById(reviewId);
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} reviewId
   * @returns
   * @memberof ReplyController
   */
  static async getReplies(reviewId) {
    // const Users = models.User;
    try {
      // const replies = await models.Reply.findAll({
      //   where: {
      //     reviewId
      //   },
      //   include: [{
      //     model: Users,
      //     as: REPLIER_LABEL,
      //     attributes: USER_QUERY_ATTRIBUTES
      //   }],
      // });

      const replies = await replyRepository.getAll({
        reviewId,
      });

      if (replies.length === 0) throw new Error(NO_REPLY);
      return !replies.length ? [] : replies;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} reviewId
   * @returns
   * @memberof ReplyController
   */
  static async returnReplies(reviewId) {
    try {
      const replies = await ReplyController.getReplies(reviewId);
      return await ReplyController.flattenReplies(replies);
    } catch (error) {
      return error;
    }
  }

  /**
   *
   *
   * @static
   * @param {*} replies
   * @returns
   * @memberof ReplyController
   */
  static async flattenReplies(replies) {
    try {
      const newReplies = replies.length && replies.map(reply => ({
        id: reply.id,
        reply: reply.reply,
        replier: reply.username,
        picture: reply.picture || '',
        avatarColor: reply.avatarColor,
        likes: reply.likes,
        userId: reply.userId,
        reviewId: reply.userId,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
      }));

      return newReplies || [];
    } catch (error) {
      return error;
    }
  }
}

export default ReplyController;
