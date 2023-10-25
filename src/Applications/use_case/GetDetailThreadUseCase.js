class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getDetailThreadById(threadId)
    let comments = await this._commentRepository.getCommentsByThreadId(threadId)

    comments = await Promise.all(
      comments.map(async (comment) => {
        return {
          id: comment.id,
          content: comment.is_delete
            ? '**komentar telah dihapus**'
            : comment.content,
          username: comment.username,
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
