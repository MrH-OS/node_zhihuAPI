/**
 * 字符串处理函数
 * @param fields<String> 需要处理的字符串
 * @param mark<any> 以 mark符号拼接成新的字符串
 * @returns {string}
 */
function extractFields(fields = '', mark = ' ') {
  let str;
  if (mark.trim().length === 0) {
    str = fields.split(';').filter(f => f).map(f => {
      if (f === 'employments') return mark + 'employments.company employments.job'
      if (f === 'educations') return mark + 'educations.school educations.major'
      return mark + f
    }).join('')
  } else {
    str = fields.split(';').filter(f => f).map(f => mark + f).join('')
  }
  return str
}

/**
 * 分页参数处理
 * @param page 当前页数
 * @param size 显示条数
 * @returns {{size: number, page: number}}
 */
function paginationUtil(page = '1', size = '10') {
  return {
    page: Math.max(+page, 1) - 1,
    size: Math.max(+size, 1)
  }
}

module.exports = {
  extractFields,
  paginationUtil
}
