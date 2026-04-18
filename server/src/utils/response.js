export const ok = (res, data = {}, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data })
}

export const created = (res, data = {}, message = 'Created') => {
  return ok(res, data, message, 201)
}

export const paginated = (res, items, total, page, limit) => {
  return res.status(200).json({
    success: true,
    data: items,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  })
}

export const notFound = (res, message = 'Not found') => {
  return res.status(404).json({ success: false, message })
}

export const forbidden = (res, message = 'Forbidden') => {
  return res.status(403).json({ success: false, message })
}

export const badRequest = (res, message = 'Bad request') => {
  return res.status(400).json({ success: false, message })
}
