class GetDetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
    likeCommentRepository,
  }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._replyRepository = replyRepository
    this._likeCommentRepository = likeCommentRepository
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getDetailThreadById(threadId)
    let comments = await this._commentRepository.getCommentsByThreadId(threadId)

    comments = await Promise.all(
      comments.map(async (comment) => {
        const likeCount = await this._likeCommentRepository.getLikeCount(
          comment.id
        )
        let replies = await this._replyRepository.getRepliesByCommentId(
          comment.id
        )

        replies = replies.map((reply) => {
          return {
            id: reply.id,
            content: reply.is_delete
              ? '**balasan telah dihapus**'
              : reply.content,
            username: reply.username,
            date: reply.date,
          }
        })
        return {
          id: comment.id,
          likeCount,
          content: comment.is_delete
            ? '**komentar telah dihapus**'
            : comment.content,
          username: comment.username,
          date: comment.date,
          replies,
        }
      })
    )

    return {
      ...thread,
      comments,
    }
  }
}

module.exports = GetDetailThreadUseCase
