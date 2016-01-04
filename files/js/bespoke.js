var estimatedYears;
var app = angular.module('deathApp', []);

app.controller('data', function ($scope, $http) {
  $http.get("angular/death/data.json")
    .success(function (response) {

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

  ///////////////////////////////////////////////////////////////////////////////
 //if select:invalid, disable submit button
  
    $('button').addClass("disabled");
    
    $.validator.setDefaults({
    debug: true,
    success: "valid",
    errorPlacement: function(error, element) { }
  });
  var form = $( "form" );
  form.validate();
  $( "form" ).change(function() {
    if(form.valid()){
      $('button').removeClass("disabled");
    } else {
      $('button').addClass("disabled");
    };
    
  });
    
  //get the form data
  //CLICK ON SUBMIT
  $scope.saveData = function () {
    var gender = $("#gender-choice").val();
    var country = $("#country-choice").val();

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

      if (gender === $scope.ages[i].SEX && country === $scope.ages[i].COUNTRY) {
        estimatedYears = $scope.ages[i].Value;

        console.log(estimatedYears)
      }

    }

    /* Minus users age from their death age, use that figure to add on to todays date = their death date.*/

    //get date:
    var d = new Date();
    var month = d.getMonth() + 1;
    month = (('' + month).length < 2 ? '0' : '') + month;
    var day = d.getDate();
    day = (('' + day).length < 2 ? '0' : '') + day;
    var year = d.getFullYear();
    estimatedYears = (estimatedYears - CurrentAge);
    year = (year + estimatedYears);

    estimatedYears = (day + '/' + month + '/' + year);
    console.log("Date:" + estimatedYears);

    //based on more-factors change days, months, years
    /* 
    value = 0 nothing
    value = 1, + one more year
    value = 2, - one year
    value = 3, - 2 years
    value = 4, - 3 years
    value = 5, - 5 years
    value = 6, - 7 years
    
    value = 20, + 2 years
    value = 30, + 3 years
    value = 40, + 5 years
    */
    //get values from more-factors
    var Overweight = $("#overweight-choice").val();
    var Alcohol = $("#alcohol-choice").val();
    var Smoking = $("#smoking-choice").val();
    var Pollution = $("#pollution-choice").val();
    var Excercise = $("#exercise-choice").val();

    console.log(Overweight);


  }; //end of click submit
  //end of data controller
});
  
  