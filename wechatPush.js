const req = require('./utils/require')
const config = require('config')

const push = async (msg) => {
    let postUrl = config.wechat.url
    let headers = {
        'token': config.wechat.token
    }
    let postData = {
        'message': msg + "\n来自" + hostname,
    }

    let loginRes = await req.post(postUrl, postData, '', headers)
}

module.exports = { push }