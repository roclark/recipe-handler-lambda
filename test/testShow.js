var expect = require('chai').expect;
var Show = require('../show.js');

var firstRecipe = {
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
    "picture": true
};

var secondRecipe = {
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
    "picture": false
};

describe('Test Show Functions:', function() {
    it('hasPicture should return true when a picture is saved', function() {
        var expected = true;

        var result = Show.hasPicture(firstRecipe);

        expect(result).to.be.equal(expected);
    });

    it('hasPicture should return false when a picture is not saved', function() {
        var expected = false;

        var result = Show.hasPicture(secondRecipe);

        expect(result).to.be.equal(expected);
    });

    it('getImageLink should return the url to an image if saved', function() {
        // For the sake of tests, default the bucket name to '' (an empty string) instead of attempting
        // to parse for unique environments. This way, the test should still pass on new instances of
        // the repository, and in automated test environments.
        var expected = 'https://s3.amazonaws.com//recipe_pictures/06c7bc35b93cefcd30423bfc7a94634a.jpg';

        var result = Show.getImageLink(firstRecipe);

        expect(result).to.be.equal(expected);
    });
});
