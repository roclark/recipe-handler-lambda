'use strict';

const BODY_TEMPLATE_3 = 'bodyTemplate3';
const LIST_TEMPLATE_1 = 'listTemplate1';
const BUCKET = '';

module.exports = {
    supportsDisplay: function() {
        var hasDisplay =
            this.event.context &&
            this.event.context.System &&
            this.event.context.System.device &&
            this.event.context.System.device.supportedInterfaces &&
            this.event.context.System.device.supportedInterfaces.Display

        return hasDisplay;
    },
    hasPicture: function(data) {
        return data.picture;
    },
    getImageLink: function(data) {
        var link = 'https://s3.amazonaws.com/' + BUCKET + '/recipe_pictures/' + data.key + '.jpg';
        return link;
    },
    renderTemplate: function(templateType, data) {
        switch(templateType) {
            case LIST_TEMPLATE_1:
                var listItems = [];
                var speechOutput = '';
                var cardOutput = '';
                data.forEach(function(recipe) {
                    var imageData = {};

                    if (module.exports.hasPicture(recipe)) {
                        var imageLink = module.exports.getImageLink(recipe);
                        imageData = {
                            'sources': [
                                {
                                    'url': imageLink
                                }
                            ]
                        };
                    }

                    if (speechOutput != '') {
                        speechOutput += ', ';
                        cardOutput += '\n';
                    }
                    listItems.push({
                        'image': imageData,
                        'token': recipe.title,
                        'textContent': {
                            'primaryText': {
                                'text': '<font size="3">' + recipe.title.replace('&', '&amp;') + '</font>',
                                'type': 'RichText'
                            },
                            'secondaryText': {
                                'text': '<font size="2">' + recipe.caption.replace('&', '&amp;') + '</font>',
                                'type': 'RichText'
                            }
                        }
                    });
                    speechOutput += recipe.title.replace('&', ' and ');
                    cardOutput += recipe.title.replace('&', ' and ');
                });

                var response = {
                    'version': '1.0',
                    'response': {
                        'directives': [
                            {
                                'type': 'Display.RenderTemplate',
                                'template': {
                                    'type': 'ListTemplate1',
                                    'token': 'string',
                                    'backButton': 'HIDDEN',
                                    'title': 'List Recipes',
                                    'listItems': listItems,
                                }
                            }
                        ],
                        'outputSpeech': {
                            'type': 'SSML',
                            'ssml': '<speak> ' + speechOutput + ' </speak>'
                        },
                        'shouldEndSession': true,
                        'card': {
                            'type': 'Simple',
                            'title': 'Recipes List',
                            'content': cardOutput
                        }
                    },
                    'sessionAttributes': {}
                }
                this.context.succeed(response);
                break;
            case BODY_TEMPLATE_3:
                var imageData = {};

                if (module.exports.hasPicture(data)) {
                    var imageLink = module.exports.getImageLink(data);
                    imageData = {
                        'sources': [
                            {
                                'url': imageLink
                            }
                        ]
                    };
                }

                var textContent = '<font size="2">';
                var cardContent = 'Ingredients:\n';
                data.ingredients.forEach(ingredient => {
                    textContent += '\u{2022} ' + ingredient + '<br/>';
                    cardContent += '\u{2022} ' + ingredient + '\n';
                });
                textContent += '<br/>' + data.directions + '</font>';
                cardContent += '\nDirections:\n' + data.directions;
                var response = {
                    'version': '1.0',
                    'response': {
                        'directives': [
                            {
                                'type': 'Display.RenderTemplate',
                                'template': {
                                    'type': 'BodyTemplate3',
                                    'token': 'string',
                                    'backButton': 'HIDDEN',
                                    'title': data.title.replace('&', '&amp;'),
                                    'image': imageData,
                                    'textContent': {
                                        'primaryText': {
                                            'type': 'RichText',
                                            'text': textContent
                                        }
                                    }
                                }
                            }
                        ],
                        'outputSpeech': {
                            'type': 'SSML',
                            'ssml': '<speak>Here are the details for ' + data.title.replace('&', ' and ') + '</speak>'
                        },
                        'shouldEndSession': true,
                        'card': {
                            'type': 'Simple',
                            'title': data.title,
                            'content': cardContent
                        }
                    },
                    'sessionAttributes': {}
                }
                this.context.succeed(response);
        }
    }
}
