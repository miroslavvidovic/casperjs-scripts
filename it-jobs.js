/**
 * Extract IT jobs posted on the the Employment Agency of Republika Srpska website.
 */

var casper = require('casper').create();
var jobs = [];

function getjobs() {
    var jobs = document.querySelectorAll('h2 a');
    return Array.prototype.map.call(jobs, function(e) {
        return e.getAttribute('title') + '\n    ' + e.getAttribute('href');
    });
}

casper.start('http://www.zzzrs.net/index.php/nezaposleni/oglasi_svi/search&category=informatika_programiranje/');

casper.then(function() {
    // aggregate results for the 'phantomjs' search
    jobs = jobs.concat(this.evaluate(getjobs));
});

casper.run(function() {
    // echo results in some pretty fashion
    this.echo(jobs.length + ' jobs found:\n');
    this.echo(' * ' + jobs.join('\n * ')).exit();
});
