var AWS = require('aws-sdk-mock');
var expect = require('chai').expect;
var Recipes = require('../recipes.js');
var sinon = require('sinon');

var firstRecipe = `
    {
    "key": "06c7bc35b93cefcd30423bfc7a94634a",
    "title": "R&V's Olive Burger",
    "caption": "Robert and Vivian's twist on Arts Tavern's famous olive burger in Glen Arbor, Michigan",
    "ingredients":
        [
            "Ground Beef",
            "Large Hamburger Buns",
            "Sliced Green Olives",
            "Lawry's Seasoning",
            "Ketchup",
            "Mustard"
        ],
    "directions": "Mix in desired amount of Lawry's seasoning with ground beef and shape into patties. Grill hamburgers. Add olives and condiments as desired when meat is done. Enjoy!",
    "picture": "RVsOliveBurger.jpg"
}`;

var secondRecipe = `
{
    "key": "6e7aa6897b607b30ef25a73331cfb3fa",
    "title": "Shrimp and Asparagus Stir Fry",
    "caption": "Spicy and soy saucy shrimp and asparagus.",
    "ingredients":
        [
            "4 tbsp. olive oil",
            "1 lb. raw shrimp",
            "1 lb. asparagus",
            "1 tsp. salt",
            "1/2 tsp. crushed red pepper",
            "1 tsp. minced garlic",
            "1 tsp. minced ginger",
            "1 tbsp. soy sauce",
            "2 tbsp. lemon juice"
        ],
    "directions": "In a large frying pan, heat 2 tablespoons olive oil over medium-high heat. Add shrimp to the pan, then season with half teaspoon of salt and half teaspoon crushed red pepper. Cook until the shrimp is pink. Remove the shrimp from the pan and set aside. In the same pan, heat 2 tablespoons olive oil and add asparagus. Add ginger and garlic, then season with half teaspoon of salt. Stir frequently and cook until the asparagus is tender-crisp. Return the shrimp to the pan, then add soy sauce. Stir until the ingredients are well combined. Just before the dish is ready, add lemon juice, stir once more, then serve while hot.",
    "picture": "ShrimpandAsparagusStirFry.jpg"
}`;

var thirdRecipe = `
{
    "key": "8db7965b5960a7b3ee4068ffd22a64a7",
    "title": "Honey Lime Garlic Butter Salmon",
    "caption": "Baked honey lime garlic butter salmon.",
    "ingredients": [
        "1/4 cup honey",
        "4 crushed large cloves garlic",
        "2 juiced limes",
        "2.5 lbs. side of salmon",
        "sea salt",
        "cracked pepper",
        "lime slices (to serve)",
        "1/4 cup fresh chopped parsley"
    ],
    "directions": "Position a rack in the middle of the oven. Preheat oven to 375 degrees F | 190 degrees C. Line a baking sheet with a large piece of foil, or 2 long pieces of foil overlapping each other lengthways if your salmon is wide. In a small saucepan, melt the butter over low-medium heat. Add honey, garlic, and lime juice, and whisk until the honey has melted through the butter and the mixture is well combined. Place the salmon onto lined baking sheet. Evenly pour the honey-lime mixture over the salmon. Sprinkle with a good amount of salt (about 2 teaspoons), cracked pepper, and 2 tablespoons of parsley. Fold the sides of the foil up beside the salmon to keep the sauce under the fillet. Bake until cooked through (about 15-18 minutes, depending on the thickness of your fish and your preference of doneness). Then, change oven setting to broil (or grill) for 2-3 minutes on medium heat to caramelize the top. Garnish with remaining parsley and serve immediately with fresh lime slices.",
    "picture": "HoneyLimeGarlicButterSalmon.jpg"
}`;

const recipeFiles = [{'Body': firstRecipe}, {'Body': secondRecipe}, {'Body': thirdRecipe}];

const goodRecipes = [
    {
        "key": "06c7bc35b93cefcd30423bfc7a94634a",
        "title": "R&V's Olive Burger",
        "caption": "Robert and Vivian's twist on Arts Tavern's famous olive burger in Glen Arbor, Michigan",
        "ingredients":
            [
                "Ground Beef",
                "Large Hamburger Buns",
                "Sliced Green Olives",
                "Lawry's Seasoning",
                "Ketchup",
                "Mustard"
            ],
        "directions": "Mix in desired amount of Lawry's seasoning with ground beef and shape into patties. Grill hamburgers. Add olives and condiments as desired when meat is done. Enjoy!",
        "picture": "RVsOliveBurger.jpg"
    },
    {
        "key": "6e7aa6897b607b30ef25a73331cfb3fa",
        "title": "Shrimp and Asparagus Stir Fry",
        "caption": "Spicy and soy saucy shrimp and asparagus.",
        "ingredients":
            [
                "4 tbsp. olive oil",
                "1 lb. raw shrimp",
                "1 lb. asparagus",
                "1 tsp. salt",
                "1/2 tsp. crushed red pepper",
                "1 tsp. minced garlic",
                "1 tsp. minced ginger",
                "1 tbsp. soy sauce",
                "2 tbsp. lemon juice"
            ],
        "directions": "In a large frying pan, heat 2 tablespoons olive oil over medium-high heat. Add shrimp to the pan, then season with half teaspoon of salt and half teaspoon crushed red pepper. Cook until the shrimp is pink. Remove the shrimp from the pan and set aside. In the same pan, heat 2 tablespoons olive oil and add asparagus. Add ginger and garlic, then season with half teaspoon of salt. Stir frequently and cook until the asparagus is tender-crisp. Return the shrimp to the pan, then add soy sauce. Stir until the ingredients are well combined. Just before the dish is ready, add lemon juice, stir once more, then serve while hot.",
        "picture": "ShrimpandAsparagusStirFry.jpg"
    },
    {
        "key": "8db7965b5960a7b3ee4068ffd22a64a7",
        "title": "Honey Lime Garlic Butter Salmon",
        "caption": "Baked honey lime garlic butter salmon.",
        "ingredients": [
            "1/4 cup honey",
            "4 crushed large cloves garlic",
            "2 juiced limes",
            "2.5 lbs. side of salmon",
            "sea salt",
            "cracked pepper",
            "lime slices (to serve)",
            "1/4 cup fresh chopped parsley"
        ],
        "directions": "Position a rack in the middle of the oven. Preheat oven to 375 degrees F | 190 degrees C. Line a baking sheet with a large piece of foil, or 2 long pieces of foil overlapping each other lengthways if your salmon is wide. In a small saucepan, melt the butter over low-medium heat. Add honey, garlic, and lime juice, and whisk until the honey has melted through the butter and the mixture is well combined. Place the salmon onto lined baking sheet. Evenly pour the honey-lime mixture over the salmon. Sprinkle with a good amount of salt (about 2 teaspoons), cracked pepper, and 2 tablespoons of parsley. Fold the sides of the foil up beside the salmon to keep the sauce under the fillet. Bake until cooked through (about 15-18 minutes, depending on the thickness of your fish and your preference of doneness). Then, change oven setting to broil (or grill) for 2-3 minutes on medium heat to caramelize the top. Garnish with remaining parsley and serve immediately with fresh lime slices.",
        "picture": "HoneyLimeGarlicButterSalmon.jpg"
    }
]

describe('Test Recipe Parsing:', function() {
    it('getSpokenRecipe should return recipe name', function() {
        var recipeSlot = {};
        recipeSlot.value = 'My Recipe Name';
        var expectedName = 'my recipe name';

        var name = Recipes.getSpokenRecipe(recipeSlot);

        expect(name).to.be.equal(expectedName);
    });

    it('getSpokenRecipe should return nothing when recipeSlot is invalid', function() {
        var recipeSlot = {};
        var expectedName = undefined;

        var name = Recipes.getSpokenRecipe(recipeSlot);

        expect(name).to.be.equal(expectedName);
    });

    it('listRecipes should list the recipe titles as a single string separated by comma', function() {
        var expectedString = 'R and V\'s Olive Burger, Shrimp and Asparagus Stir Fry, Honey Lime Garlic Butter Salmon'

        var outputString = Recipes.listRecipes(goodRecipes);

        expect(outputString).to.be.equal(expectedString);
    });

    it('parseIngredients should list the ingredients for a recipe as a single string separated by comma', function() {
        var expectedString = '1/4 cup honey, 4 crushed large cloves garlic, 2 juiced limes, 2.5 lbs. side of salmon, sea salt, cracked pepper, lime slices (to serve), 1/4 cup fresh chopped parsley';

        var outputIngredients = Recipes.parseIngredients(goodRecipes[2].ingredients);

        expect(outputIngredients).to.be.equal(expectedString);
    });

    it('getRandomRecipe should return a random recipe', function() {
        var expected = goodRecipes[2];
        sinon.stub(Recipes, 'randomNumber').returns(0.99999);

        Recipes.getRandomRecipe(goodRecipes, result => {
            expect(result).to.be.equal(expected);
        });
    });

    it('matchRecipe should return the key for a perfectly matched recipe name', () => {
        var expected = goodRecipes[0];

        Recipes.matchRecipe('R&V\'s Olive Burger', goodRecipes, result => {
            expect(result).to.be.equal(expected);
        });
    });

    it('matchRecipe should return the key for a close-enough matched recipe name', () => {
        var expected = goodRecipes[0];

        Recipes.matchRecipe('R and V Alive Boogie', goodRecipes, result => {
            expect(result).to.be.equal(expected);
        });
    });
});

describe('Test AWS:', function() {
    it('getAllRecipeData should return all recipes saved in AWS', (done) => {
        var keys = {
            'Contents': [
                {'Key': 'recipes/'},
                {'Key': 'recipes/06c7bc35b93cefcd30423bfc7a94634a'},
                {'Key': 'recipes/6e7aa6897b607b30ef25a73331cfb3fa'},
                {'Key': 'recipes/8db7965b5960a7b3ee4068ffd22a64a7'},
            ]
        }
        var shortKeys = ['recipes/06c7bc35b93cefcd30423bfc7a94634a', 'recipes/6e7aa6897b607b30ef25a73331cfb3fa', 'recipes/8db7965b5960a7b3ee4068ffd22a64a7'];
        var expected = goodRecipes;

        AWS.mock('S3', 'listObjects', function(params, callback) {
            callback(null, keys);
        });
        AWS.mock('S3', 'getObject', function(params, callback) {
            var index = shortKeys.indexOf(params.Key);
            callback(null, recipeFiles[index]);
        });

        Recipes.getAllRecipeData(recipes => {
            expect(JSON.stringify(recipes)).to.be.equal(JSON.stringify(recipes));
            done();
        });
    });
});

describe('Test Validation:', function() {
    it('validateResponse should return valid responses', () => {
        var response = 'This is a valid response with no bad characters';
        var expected = response;

        var result = Recipes.validateResponse(response);

        expect(result).to.be.equal(expected);
    });

    it('validateResponse should return a cleaned response when invalid', () => {
        var response = String.fromCharCode( 65279 ) + 'This is not a valid response';
        var expected = 'This is not a valid response';

        var result = Recipes.validateResponse(response);

        expect(result).to.be.equal(expected);
    });
});
