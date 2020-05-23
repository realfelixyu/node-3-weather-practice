const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3000

const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name : 'Felix Yu'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name : 'Felix Yu'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: "This is a help page",
        title: 'Help',
        name: "Felix Yu"
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address"
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            res.send({
                error
            })
        } else {
            forecast(latitude, longitude, (error, data) => {
                if (error) {
                    res.send({
                        error
                    })
                } else { 
                    res.send({
                        forecast: data.description[0] + ". It is currently " + data.temperature,
                        location: location,
                        address: req.query.address
                    })
                }
            })
        }
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error : 'You must provide a search term'
        })
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: '404',
        name: 'Felix Yu',
        errorMessage : "Help page not found"
    })
})

app.get('*', (req, res) => {
    res.render('error', {
        title: '404',
        name: 'Felix Yu',
        errorMessage : "404 page not found"
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

