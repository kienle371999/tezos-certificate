'use strict';

var validateDate = function(date) {
  var done = this.async();
  var regex = /\d{2}\/\d{2}\/\d{4}/g;

  setTimeout(function() {
    if (!regex.test(date)) {
      done('You need to provide a valid date');
      return;
    }

    done(true);
  }, 1000);
};

module.exports = [{
  type: 'input',
  name: 'courseName',
  message: 'What\'s the name of your course?'
}, 
{
  type: 'input',
  name: 'totalHours',
  message: 'What\'s the duration of your course in hours? (ex: 20 hours)'
}, {
  type: 'input',
  name: 'city',
  message: 'In which city your course happened?'
}];
