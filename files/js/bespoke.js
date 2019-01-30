var estimatedYears;
var AgeAtDeath, dead_yet;
var app = angular.module('deathApp', []);
app.controller('data', function ($scope, $http) {
  $http.get("angular/death/data.json").success(function (response) {
    $scope.ages = response.fact;
    $scope.predicate = 'COUNTRY';
    $scope.reverse = false;
    $scope.order = function (predicate) {
      $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
      $scope.predicate = predicate;
    };
  });
  /*Repeating numbers for date of birth*/
  $scope.number = 31;
  $scope.dateNumber = function (num) {
    return new Array(num);
  };
  $scope.year = 96;
  $scope.yearNumber = function (num) {
    return new Array(num);
  };
  /*TOGGLE THE DATA TABLE*/
  $(".show-table").on("click", function () {
    $(".hide-div").toggle();
  });
  //change color of icon
  $scope.isInvalid = function (field) {
    return $scope.myForm[field].$invalid && $scope.myForm[field].$dirty;
  };
  $scope.isValid = function (field) {
    return $scope.myForm[field].$valid && $scope.myForm[field].$dirty;
  };
  //get the form data
  //CLICK ON SUBMIT
  $scope.saveData = function () {
    var gender = $("#gender-choice").val();
    var country = $("#country-choice").val();
    //console.log("gender: " + gender);
    //DOB
    var day = $("#dob-day").val();
    day = ("0" + day).slice(-2);
    var month = $("#dob-month").val();
    var year = $("#dob-year").val();
    var dataArray = [];
    dataArray.push(year + month + day);
    //CALCULATE AGE OF USER
    function getAge(birthDate) {
      var now = new Date();

      function isLeap(year) {
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
      }
      // days since the birthdate    
      var days = Math.floor((now.getTime() - birthDate.getTime()) / 1000 / 60 / 60 / 24);
      var age = 0;
      // iterate the years
      for (var y = birthDate.getFullYear(); y <= now.getFullYear(); y++) {
        var daysInYear = isLeap(y) ? 366 : 365;
        if (days >= daysInYear) {
          days -= daysInYear;
          age++;
          // increment the age only if there are available enough days for the year.
        }
      }
      return age;
    }
    var birthDateStr = dataArray[0],
      parts = birthDateStr.match(/(\d{4})(\d{2})(\d{2})/),
      dateObj = new Date(parts[1], parts[2] - 1, parts[3]); // months 0-based!
    var CurrentAge = getAge(dateObj)
    console.log("CURRENT AGE:" + CurrentAge);
    //OBTAIN THEIR DEATH AGE
    //save their gender and country
    for (var i = 0; i < $scope.ages.length; i++) {
      if (gender === "Female" && country === $scope.ages[i].COUNTRY) {
        estimatedYears = $scope.ages[i].Female;
      } else if (gender === "Male" && country === $scope.ages[i].COUNTRY) {
        estimatedYears = $scope.ages[i].Male;
      }
      AgeAtDeath = estimatedYears;
      console.log("estimatedYears: " + estimatedYears)
    }
    /* Minus users age from their death age, use that figure to add on to todays date = their death date.*/
    //get date:
    var d = new Date();
    var day = parseInt(Math.random() * (30 - 1) + 1);
    console.log("day: " + day);
    day = (('' + day).length < 2 ? '0' : '') + day;
    var month = parseInt(Math.random() * (12 - 1) + 1);
    console.log("month: " + month);
    month = (('' + month).length < 2 ? '0' : '') + month;
    var year = d.getFullYear();
    estimatedYears = (estimatedYears - CurrentAge);
    year = (year + estimatedYears);
    estimatedYears = (day + '/' + month + '/' + year);
    var calc_days = (year + '/' + 'month' + 'day');
    //based on more-factors change days, months, yearsvalue = + or - is for the amount of //years added to the year of death

    //get values from more-factors
    /*     var Overweight = $("#overweight-choice").val();
        var Alcohol = $("#alcohol-choice").val();
        var Smoking = $("#smoking-choice").val();
        var Pollution = $("#pollution-choice").val();
        var Excercise = $("#exercise-choice").val(); */

    var Overweight = "-2";
    var Alcohol = "-2";
    var Smoking = "-2";
    var Pollution = "-2";
    var Excercise = "+2";
    console.log("Overweight: " + Overweight + ", Alchohol: " + Alcohol + ", Smoking: " + Smoking + ", Pollution: " + Pollution + ", Exercise: " + Excercise);
    var factors_arr = [];
    factors_arr.push(Overweight, Alcohol, Smoking, Pollution, Excercise)

    console.log("factors_arr: " + factors_arr);
    //if (Overweight:contains("-")AlcoholSmoking Pollution,Excercise)








    // console.log("Date:" + estimatedYears);
    //x days left
    var xdays = parseInt(AgeAtDeath) - parseInt(CurrentAge);
    xdays = xdays * 365;
    //console.log("xdays: " + xdays);
    //year = parseInt(year);
    //console.log("year: " + year);
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(year, month - 1, day);
    var secondDate = new Date();
    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    //console.log("oneDay: " + oneDay + ' , firstDate:' + firstDate + ', secondDate:' + secondDate + ', diffDays:' + diffDays);
    if (parseInt(AgeAtDeath) < parseInt(CurrentAge)) {
      dead_yet = "Hang on, your supposed to be dead! 😲";
    } else {
      dead_yet = "You have <strong>" + diffDays + "</strong> days left to live, hows your bucket list looking?";
    }
    $.jAlert({
      'title': 'You will die on:',
      'content': '<h2>' + estimatedYears + ' aged ' + AgeAtDeath + '</h2><h3> Current age: ' + CurrentAge + '</h3>' + dead_yet,
      'theme': 'black',
      'size': 'lg',
      'showAnimation': 'fadeInUp',
      'hideAnimation': 'fadeOutDown'
    });
  }; //end of click submit
  //end of data controller
});