import _ from 'underscore'

// App config the for development environment.
const devServerURL = 'http://isomorphic-wb.oss-cn-hangzhou.aliyuncs.com'
const isProduction = process.env.NODE_ENV === "production"

const config = _.extend({
	debug: !isProduction,
	serverURL: isProduction ? 'http://isomorphic-wb.oss-cn-hangzhou.aliyuncs.com' : "http://192.168.1.102:3154",
}, isProduction ? {} : {
	token: "2.00EXkndCnB1OwB4454f329dcCLyALC",
})

export default config
