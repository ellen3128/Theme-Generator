const Theme = require('../models/theme')
const Styleset = require('../models/styleset')
const openAI = require('../config/openai')

module.exports = {
    index,
    new: newTheme, 
    create, 
    delete: deleteTheme, 
    show
}

function index(req, res) {
    // res.render('themes/index', {title: 'Theme List', errorMsg: ''})
    Theme.find({})
    .then(results=>res.render('themes/index', {title: "Theme List", themes: results}))
    .catch(err=>res.send(err))
}

function newTheme(req, res) {
    res.render('themes/new', {title: 'New Theme', errorMsg: ''})
}

async function create(req, res) {
    const themeData = {...req.body}
    try {
        const createdTheme = await Theme.create(themeData)
        res.redirect("/themes/");
    } catch (err) {
        res.render("themes/new", {errorMsg: err.message});
    }
}

async function deleteTheme(req, res) {
    await Theme.deleteOne({_id: req.params.id})
    .then(function() {
        res.redirect('/themes/')
    })
    .catch(function(){
        console.log(err)
    })
}

async function show(req, res) {
    
    
    try {
        const themes = await Theme.findById(req.params.id)
        const openAIResponse = await openAI.sendRequest(`Theme: ${themes.theme}. Theme description: ${themes.description} Respond with a JSON-like answer on what font color rgba, public Google font href, and background color rgba could be used for this theme`)
        res.render('themes/show', {
            title: `${themes.theme}`, 
            themes, 
            openAIResponse
        })
    } catch(err) {
        res.render('themes/show', {errorMsg: err.message})
    }
    
    // res.send(openAIResponse)
}