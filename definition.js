var oxfortDictBasePath = "https://od-api.oxforddictionaries.com:443/api/v1/entries/";
var language = "en";

var oxfordDictId = "your_oxford_dist_id";
var oxfordDistKey = "your_oxford_dist_key";

var wordnikBasePath = "https://api.wordnik.com:80/v4/word.json/";
var wordnikKey = "your wordnikkey";
// Wordnik sample request
// http://api.wordnik.com:80/v4/word.json/include/definitions?
// limit=200&includeRelated=true&useCanonical=false&includeTags=false&
// api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5

// alert("content loaded successfully");

console.log($)

// var element = $("body p");
// console.log(element)
// if (element.length) {
//     element.on("click", function(e) {
//         alert($);
//         console.log("clicked on some element");
//     });
// }

// console.log(browser);
$(document).ready(function() {
    var comments = (function() {
        var selectionObject; // = getSelectedText();

        var text; // = selectionObject.toString();
        var range;
        var count = $("#comments p").length;
        var position;
        bootstrap_alert = function() {}

        var getSelectedText = function() {
            if (window.getSelection) {
                return window.getSelection();
            } else if (document.selection) {
                return document.selection.createRange().text;
            }
            return '';
        }

        var getData = function(word) {
            // var url = oxfortDictBasePath + language + "/" + word + "?app_key=" + oxfordDistKey + "&app_id=" + oxfordDictId;
            var defType = "defination";
            // var url = wordnikBasePath + word + "/definitions?api_key=" + wordnikKey;
            var url = oxfortDictBasePath + language + "/" + word;
            return $.ajax({
                // type: 'GET',
                url: url,
                headers: {
                    'app_id': oxfordDictId,
                    'app_key': oxfordDistKey
                },
                // contentType: "application/json",
                // beforeSend: function(request) {
                //     request.setRequestHeader('app_id': oxfordDictId, 'app_key': oxfordDistKey);
                // },

                success: function(data) {
                    console.log(data);
                    render_result(data.results);
                    return;
                },
                error: function(data) {
                    console.log("error occurred");
                    console.log(data);
                    return;
                }
            });
        }

        var render_result = function(data) {
            var defination = parseOxfordDictResults(data);
            var html = createHtml(defination);
            show_definition(html);
        }

        var parseOxfordDictResults = function(results) {
            var data = {};

            if (results[0]) {
                // Considering only first element of result as of now
                var result = results[0];
                var lexicalEntry = result.lexicalEntries[0];
                if (result.word)
                    data.word = result.word;
                if (lexicalEntry.lexicalCategory)
                    data.lexicalCategory = lexicalEntry.lexicalCategory;
                data.pronunciations = {}
                if (lexicalEntry.pronunciations[0].audioFile)
                    data.pronunciations.audioFile = lexicalEntry.pronunciations[0].audioFile;
                if (lexicalEntry.pronunciations[0].phoneticSpelling)
                    data.pronunciations.phoneticSpelling = lexicalEntry.pronunciations[0].phoneticSpelling;
                if (lexicalEntry.entries[0].senses[0].definitions)
                    data.definition = lexicalEntry.entries[0].senses[0].definitions[0];
                if (lexicalEntry.entries[0].senses[0].examples)
                    data.example = lexicalEntry.entries[0].senses[0].examples[0].text;
            }
            return data;
        }

        var getDefination = function(word) {
            var defination = "meaning of " + word;
            getData(word);
            return;
        }

        var createHtml = function(data) {
            var html = "<p><strong style='text-transform: capitalize;font-size: medium;'>" + data.word + "</strong> <span>/" + data.pronunciations.phoneticSpelling + "/</span>";
            html += " <span style='font-size: small;'>(" + data.lexicalCategory + ")</span>";
            if (data.definition) {
                html += "<p style='margin:0px; padding:0px;'>" + data.definition + "</p>";
                if (data.example)
                    html += "<p> <strong>Ex: </strong>" + data.example + "</p>"
            }
            html += "<span class='down_arrow' style='width: 44x;border: 22px solid;\
                    position: absolute;\
                    border-color: #4caf4f transparent #f5f5dc00;'></span>"
            return html;
        }

        var selectText = function(event) {
            closeAlert();
            selectionObject = getSelectedText();
            anchorNode = selectionObject;
            text = selectionObject.toString();
            console.log(text);
            query = prepareQuery(text);
            is_valid_query = validateQuery(query);
            query = encodeURI(query);
            if (is_valid_query) {
                getDefination(query);
                position = getAlertBoxPosition(event);
            }
        };

        var validateQuery = function(query) {
            if (query == "") {
                return false;
            }
            // considering the longest word in English Oxford dict: antidisestablishmentarianism
            if (query.length > 29)
                return false;
            if (query.indexOf(' ') >= 0)
                return false;
            return true
        }

        var prepareQuery = function(query) {
            query = query.trim();
            query = query.toLowerCase()
            return query;
        }

        var getAlertBoxPosition = function(event) {
            var windowWidth = $(window).width();
            var whichOffset = "";
            if (event.pageX < (windowWidth / 2)) {
                whichOffset = "left";
            } else {
                whichOffset = "right";
            }
            return {
                'pageX': event.pageX,
                'pageY': event.pageY
            };
        };

        var closeAlert = function() {
            $("#floating_alert").hide();
        };

        var showAlert = function() {
            $("#floating_alert").show();
        };

        var show_definition = function(message) {
            var popup_element = $('#floating_alert');
            if (popup_element.length == 0) {
                $('body').append('<div id="floating_alert"></div>');
                popup_element = $('#floating_alert');
            }
            popup_element[0].innerHTML = message;
            console.log(position)
            console.log("width = " + popup_element.outerWidth() + ", height = " + popup_element.outerHeight())
            popup_element.css({
                'position': 'absolute',
                'z-index': 9999,
                'background-color': '#4CAF50',
                'color': 'white',
                'left': position.pageX - 25,
                'top': position.pageY - popup_element.outerHeight(),
                'padding': '10px',
                'border-radius': '10px'
            });
            $('#floating_alert > p').css({
                'margin': 0,
                'padding': 0
            });
            showAlert();
            // $('#floating_alert .down_arrow').css({
            //     'left': position.pageX,
            //     'top': position.pageY,
            // });
            // playAudioFile();
        };

        var playAudioFile = function() {
            var audio = {};
            audio["walk"] = new Audio();
            var audioFile = $("#pronunciations_audio").data("src");
            audio["walk"].src = audioFile;
            audio["walk"].addEventListener('load', function() {
                audio["walk"].play();
            });
        }
        var bindFunctions = function() {
            $("body").on('mouseup', selectText);
            // $('#pronunciations_audio').on('click', playAudioFile);
            // $('p').on('click', selectText);
            $('#close_floating_alert').bind('click', closeAlert);
        };

        var init = function() {
            bindFunctions();
        };

        return {
            init: init,
        };
    })();
    comments.init();
});
