class Reply {
  constructor(payload) {
    this._verifyPayload(payload)

    const { id, content, owner, date, is_delete } = payload

    this.id = id
    this.content = is_delete ? '**balasan telah dihapus**' : content
    this.owner = owner
    this.date = date
  }

  _verifyPayload({ id, content, owner, date, is_delete }) {
    if (!id || !content || !owner || !date || is_delete === undefined) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string' ||
      !(date instanceof Date) ||
      typeof is_delete !== 'boolean'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = Reply
