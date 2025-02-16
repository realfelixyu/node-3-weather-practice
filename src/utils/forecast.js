const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = "http://api.weatherstack.com/current?access_key=39ed8ac9e7917aef84c9357194757103&query=" + latitude + "," + longitude + "&units=f"

    request({url, json:true}, (error, {body} = {}) => {
        if (error) {
            callback("Unable to connect to weather service!", undefined)
        } else if (body.error) {
            callback("Unable to find location", undefined)
        } else {
            callback(undefined, {
                description : body.current.weather_descriptions,
                temperature : body.current.temperature,
                rainchance :  body.current.precip,
                feels : body.current.feelslike
               })
            }
        })
}

module.exports = forecast