const schedule = require('node-schedule')
const sqlite3 = require('sqlite3')

const start = async () => {
    
}

// */15 * * * MON-FRI
const j = schedule.scheduleJob("*/15 * * * MON-FRI", async () => {
    try {
        start()
    } catch (err) {
        console.log(err)
    }
})