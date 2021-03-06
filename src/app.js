const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Set up static directory
app.use(express.static(publicPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Katie Loyd'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Katie Loyd'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'Have you tried turning it off and on again?',
        name: 'Katie Loyd'
    })
})

app.get('/weather', (req, res) => {
    const locQuery = req.query.location
    if (!locQuery) {
        return res.send({
            error: 'You must provide a location'
        })
    }

    geocode(locQuery, (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return res.send({ error })
        } 
        
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error })
            }
            res.send({
                location,
                forecast: forecastData
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        error: 'Help article not found',
        name: 'Katie Loyd'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Error',
        error: 'Page not found',
        name: 'Katie Loyd'
    })
})

app.listen(port, () => {})