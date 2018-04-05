'use strict';

const AWS = require('aws-sdk');
AWS.config.update({accessKeyId: '', secretAccessKey: ''});
const getClosest = require('get-closest');
const Levenshtein = require('levenshtein');
const Promise = require('bluebird');

module.exports = {
    compareLevenshteinDistance: function(compareTo, baseItem) {
        return new Levenshtein(compareTo, baseItem).distance;
    },
    validateResponse: function(response) {
        var firstCharCode = response.charCodeAt(0);
        if (firstCharCode == 65279) {
            return response.substring(1);
        }
        return response;
    },
    parseIngredients: function(ingredients) {
        var ingredientsList = [];
        var ingredientsString = '';
        ingredients.forEach(function(ingredient) {
            if (ingredientsString != '') {
                ingredientsString += ', ';
            }
            ingredientsList.push(ingredient);
            ingredientsString += ingredient;
        });
        return ingredientsString;
    },
    getAllRecipeData: function(callback) {
        var s3 = new AWS.S3();
        var params = {
            Bucket: '',
            Prefix: 'recipes/'
        }
        var recipes = [];

        var readRecipe = (recipe) => {
            return new Promise((resolve, reject) => {
                s3.getObject({Bucket: '', Key: recipe}, function(err, data) {
                    if (err) reject(err);
                    var fileText = data.Body.toString();
                    fileText = module.exports.validateResponse(fileText);
                    var jsonObject = JSON.parse(fileText);
                    resolve(jsonObject);
                });
            })
        }

        s3.listObjects(params, function(err, data) {
            if (err) throw err;
            var keys = [];
            data.Contents.forEach(function(item) {
                if (item.Key != 'recipes/') {
                    keys = keys.concat(item.Key);
                }
            });
            Promise.map(keys, readRecipe).then(recipes => {
                callback(recipes);
            })
        });
    },
    randomNumber: function() {
        return Math.random();
    },
    getRandomRecipe: function(recipes, callback) {
        var i = Math.floor(module.exports.randomNumber() * recipes.length);
        callback(recipes[i]);
    },
    matchRecipe: function(spokenRecipe, recipes, callback) {
        var recipeDict = {};
        var recipeNames = [];

        recipes.forEach(function(recipe) {
            var key = recipe.key;
            recipeDict[recipe.title] = recipe;
            recipeNames.push(recipe.title);
        });
        var match = getClosest.custom(spokenRecipe, recipeNames, module.exports.compareLevenshteinDistance);
        var recipe = recipeDict[recipeNames[match]];
        callback(recipe);
    },
    listRecipes: function(recipes) {
        var speechOutput = '';
        recipes.forEach(function(recipe) {
            if (speechOutput != '') {
                speechOutput += ', ';
            }
            speechOutput += recipe.title.replace('&', ' and ');
        });
        return speechOutput;
    },
    getSpokenRecipe: function(recipeSlot) {
        let recipeName;
        if (recipeSlot && recipeSlot.value) {
            recipeName = recipeSlot.value.toLowerCase();
        }
        return recipeName;
    }
}
