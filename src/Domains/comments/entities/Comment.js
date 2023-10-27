class Comment {
  constructor(payload) {
    this._verifyPayload(payload)

    const { id, content, username, date, is_delete } = payload

    this.id = id
    this.content = is_delete ? '**komentar telah dihapus**' : content
    this.username = username
    this.date = date
  }

  _verifyPayload({ id, content, username, date, is_delete }) {
    if (!id || !content || !username || !date || is_delete === undefined) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      !(date instanceof Date) ||
      typeof username !== 'string' ||
      typeof is_delete !== 'boolean'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = Comment
