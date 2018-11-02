const request = require('request').defaults({ timeout: 3000 })
const iconv = require('iconv-lite')

const reqBase = (options) => {
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (!err && ~~res.statusCode < 400) {
                resolve(res)
            } else {
                reject(err || res.statusCode)
            }
        })
    })
}

const req = async function req(options) {
    let tryTimes = 2
    while (tryTimes--) {
        try {
            return await reqBase(options)
        } catch (err) {

        }
    }
}

const genHeaders = (url, headersParams, cookies) => {
    // 补全 host,Referer,Origin
    if (!headersParams.Host && !headersParams.host) {
        headersParams.Host = url.match(/\/\/([0-9a-zA-Z-\.]*)/)[1]
    }
    if (!headersParams.Referer && !headersParams.referer) {
        headersParams.Referer = url
    }
    if (!headersParams.Origin && !headersParams.origin) {
        headersParams.Origin = url.match(/(http[s]?:\/\/[0-9a-zA-Z-\.]*)/)[1]
    }

    let headers = {
        'Accept': 'Accept: */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6',
        'Cache-Control': 'max-age=0',
        'DNT': '1',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
    }

    cookies = typeof cookies === 'string' ? cookies : cookies.map(c => `${c.name}:${c.value}`).join('; ')
    headers['Cookie'] = cookies

    headers = Object.assign(headers, headersParams)
    return headers
}

const post = (url, form, cookies, headersParams = {}, proxy = null) => {

    if (Array.isArray(form)) {
        form = form.map((object) => {
            let key = Object.keys(object)[0]
            return `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`
        }).join("&")
    }

    let headers = genHeaders(url, headersParams, cookies)

    let options = {
        url,
        method: 'POST',
        form,
        headers,
        proxy,
        encoding: null,
        gzip: true,
    }

    return req(options).then((res) => {
        res.body = iconv.decode(new Buffer(res.body), 'utf-8')
        return res
    })
}


const get = (url, cookies = '', headersParams = {}, proxy = null) => {

    let headers = genHeaders(url, headersParams, cookies)

    let options = {
        url,
        proxy,
        method: 'GET',
        headers,
        gzip: true,
    }

    return req(options).then((res) => {
        return res
    })
}

const getBinary = (url, cookies = '', headersParams = {}, proxy = null) => {

    let headers = genHeaders(url, headersParams, cookies)

    let options = {
        url,
        proxy,
        method: 'GET',
        headers,
        encoding: null,
        gzip: true,
    }

    return req(options).then((res) => {
        return res
    })
}

module.exports = { req, post, get, getBinary }