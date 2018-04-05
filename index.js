'use strict';

const Alexa = require('alexa-sdk');
const APP_ID = '';
const Recipes = require('./recipes.js');
const Show = require('./show.js');
const toTitleCase = require('to-title-case');

const BODY_TEMPLATE_3 = 'bodyTemplate3';
const LIST_TEMPLATE_1 = 'listTemplate1';

const languageStrings = {
    'en': {
        translation: {
            SKILL_NAME: 'Recipe Helper',
            WELCOME_MESSAGE: 'Welcome to %s. You can ask a question like, what is the recipe for %s? ... Now, what can I help you with?',
            WELCOME_REPROMPT: 'If you need help, just say help me',
            WELCOME_CARD_TITLE: '%s - Welcome!',
            LIST_RECIPES_CARD: '%s - Recipes',
            RECIPE_DIRECTIONS_CARD: '%s - Directions for %s',
            RECIPE_INGREDIENTS_CARD: '%s - Ingredients for %s',
            RECIPE_DESCRIPTION_CARD: '%s - %s',
            DISPLAY_CARD_TITLE: '%s - Recipe for %s',
            HELP_MESSAGE: '',
        },
    },
}

const handlers = {
    'LaunchRequest': function() {
        Recipes.getAllRecipeData(recipes => {
            Recipes.getRandomRecipe(recipes, recipe => {
                this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'), recipe.title);
                this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');

                this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
                this.response.cardRenderer(this.t('WELCOME_CARD_TITLE', this.t('SKILL_NAME')));
                this.emit(':responseReady');
            });
        });
    },
    'ListRecipes': function() {
        if (Show.supportsDisplay.call(this)) {
            Recipes.getAllRecipeData(recipes => {
                Show.renderTemplate.call(this, LIST_TEMPLATE_1, recipes);
            });
        } else {
            Recipes.getAllRecipeData(recipes => {
                var speechOutput = Recipes.listRecipes(recipes);
                this.attributes.speechOutput = speechOutput;

                this.response.speak(speechOutput);
                this.response.cardRenderer(this.t('LIST_RECIPES_CARD', this.t('SKILL_NAME')));
                this.emit(':responseReady');
            });
        }
    },
    'GetRecipeDetails': function() {
        var spokenRecipeName = Recipes.getSpokenRecipe(this.event.request.intent.slots.recipe);
        if (Show.supportsDisplay.call(this)) {
            Recipes.getAllRecipeData(recipes => {
                Recipes.matchRecipe(spokenRecipeName, recipes, recipe => {
                    Show.renderTemplate.call(this, BODY_TEMPLATE_3, recipe);
                });
            });
        } else {
            console.log('Need to implement!');
        }
    },
    'GetRecipeDirections': function() {
        var spokenRecipeName = Recipes.getSpokenRecipe(this.event.request.intent.slots.recipe);
        Recipes.getAllRecipeData(recipes => {
            Recipes.matchRecipe(spokenRecipeName, recipes, recipe => {
                this.attributes.speechOutput = recipe.directions;

                this.response.speak(recipe.directions);
                this.response.cardRenderer(this.t('RECIPE_DIRECTIONS_CARD', this.t('SKILL_NAME'), toTitleCase(recipe.title)));
                this.emit(':responseReady');
            });
        });
    },
    'GetRecipeIngredients': function() {
        var spokenRecipeName = Recipes.getSpokenRecipe(this.event.request.intent.slots.recipe);
        Recipes.getAllRecipeData(recipes => {
            Recipes.matchRecipe(spokenRecipeName, recipes, recipe => {
                var ingredients = Recipes.parseIngredients(recipe.ingredients);
                this.attributes.speechOutput = ingredients;

                this.response.speak(ingredients);
                this.response.cardRenderer(this.t('RECIPE_INGREDIENTS_CARD', this.t('SKILL_NAME'), toTitleCase(recipe.title)));
                this.emit(':responseReady');
            });
        });
    },
    'GetRecipeDescription': function() {
        var spokenRecipeName = Recipes.getSpokenRecipe(this.event.request.intent.slots.recipe);
        Recipes.getAllRecipeData(recipes => {
            Recipes.matchRecipe(spokenRecipeName, recipes, recipe => {
                this.attributes.speechOutput = recipe.caption;

                this.response.speak(recipe.caption);
                this.response.cardRenderer(this.t('RECIPE_DESCRIPTION_CARD', this.t('SKILL_NAME'), toTitleCase(recipe.title)));
                this.emit(':responseReady');
            });
        });
    },
    'GetRecipeIngredientsForDifferentServings': function() {
        var recipeName = getSpokenRecipe(this.event.request.intent.slots.recipe);
        var servings = this.event.requests.intent.slots.servings;
    },
    'AMAZON.HelpIntent': function() {

    },
    'AMAZON.RepeatIntent': function() {

    },
    'AMAZON.StopIntent': function() {

    },
    'AMAZON.CancelIntent': function() {

    },
    'SessionEndedRequest': function() {

    },
    'Unhandled': function() {

    },
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
}
