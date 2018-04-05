'use strict';

const BODY_TEMPLATE_3 = 'bodyTemplate3';
const LIST_TEMPLATE_1 = 'listTemplate1';

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
    renderTemplate: function(templateType, data) {
        switch(templateType) {
            case LIST_TEMPLATE_1:
                var listItems = [];
                var speechOutput = '';
                data.forEach(function(recipe) {
                    if (speechOutput != '') {
                        speechOutput += ', ';
                    }
                    listItems.push({
                        'image': null,
                        'token': recipe[0].title,
                        'textContent': {
                            'primaryText': {
                                'text': '<font size="3">' + recipe[0].title.replace('&', '&amp;') + '</font>',
                                'type': 'RichText'
                            },
                            'secondaryText': {
                                'text': '<font size="2">' + recipe[0].caption.replace('&', '&amp;') + '</font>',
                                'type': 'RichText'
                            }
                        }
                    });
                    speechOutput += recipe[0].title.replace('&', ' and ');
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
                            'title': 'List Recipes',
                            'content': speechOutput
                        }
                    },
                    'sessionAttributes': {}
                }
                this.context.succeed(response);
                break;
            case BODY_TEMPLATE_3:
                var textContent = '<font size="2">';
                data.ingredients.forEach(ingredient => {
                    textContent += ' - ' + ingredient + '<br/>';
                });
                textContent += '<br/>' + data.directions + '</font>';
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
                            'title': 'Recipe Description',
                            'content': textContent
                        }
                    },
                    'sessionAttributes': {}
                }
                this.context.succeed(response);
        }
    }
}
