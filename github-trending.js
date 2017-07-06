/**
 * Get github weekly trending data for a desired language
 */

var casper = require('casper').create();
var repositories = [];

// Get the user input for the desired language
// example:
// github-trending.js --language=vim-script
var language = casper.cli.get('language');

var url = 'https://github.com/trending/'+language+'?since=weekly';

var terminate = function() {
    this.echo("Exiting..").exit();
};

function getRepositories() {
    var rows = document.querySelectorAll('.repo-list li');
    var repos = [];

    for (var i = 0, row; row = rows[i]; i++) {
        var heading = row.querySelector('h3 a');
        var desc_paragraph = row.querySelector('.py-1');
        var lang_paragraph = row.querySelector('.f6 .d-inline-block');
        var total_stars_paragraph = row.querySelector('.f6 a.muted-link');
        var weekly_stars_paragraph = row.querySelector('.f6 span.float-right');

        var repository = {};

        repository['num'] = i+1;
        repository['repo'] = "https://github.com" + heading.getAttribute('href');
        repository['description'] = desc_paragraph.innerText;
        repository['language'] = lang_paragraph.innerText;
        repository['totalstars'] = total_stars_paragraph.innerText;
        repository['weeklystars'] = weekly_stars_paragraph.innerText;
        repos.push(repository);
    }

    return repos;
}

var processPage = function() {
    repositories = repositories.concat(this.evaluate(getRepositories));
    // Dump the result as json
    require('utils').dump(repositories);
};

casper.start(url);
casper.waitForSelector('.repo-list li', processPage, terminate);
casper.run();
