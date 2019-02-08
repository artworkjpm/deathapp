var estimatedYears;
var AgeAtDeath, dead_yet;
var app = angular.module('deathApp', []);
app.controller('data', function($scope, $http) {
    $http.get("angular/death/data.json").success(function(response) {
        $scope.ages = response.fact;
        $scope.predicate = 'COUNTRY';
        $scope.reverse = false;
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };
    });
    /*Repeating numbers for date of birth*/
    $scope.number = 31;
    $scope.dateNumber = function(num) {
        return new Array(num);
    };
    $scope.year = 96;
    $scope.yearNumber = function(num) {
        return new Array(num);
    };
    /*TOGGLE THE DATA TABLE*/
    $(".show-table").on("click", function() {
        $(".hide-div").toggle();
    });
    //change color of icon
    $scope.isInvalid = function(field) {
        return $scope.myForm[field].$invalid && $scope.myForm[field].$dirty;
    };
    $scope.isValid = function(field) {
        return $scope.myForm[field].$valid && $scope.myForm[field].$dirty;
    };
    //get the form data
    //CLICK ON SUBMIT
    $scope.saveData = function() {
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


        //testing code now in testing-code.js

        /* based on more-factors change days, months, yearsvalue = + or - is for the amount of years added to the year of death */
        //get values from more-factors
        var Overweight = $("#overweight-choice").val();
        var Alcohol = $("#alcohol-choice").val();
        var Smoking = $("#smoking-choice").val();
        var Pollution = $("#pollution-choice").val();
        var Exercise = $("#exercise-choice").val();

        console.log("Overweight: " + Overweight + ", Alchohol: " + Alcohol + ", Smoking: " + Smoking + ", Pollution: " + Pollution + ", Exercise: " + Exercise);
        var factors_arr = [];
        factors_arr.push(Overweight, Alcohol, Smoking, Pollution, Exercise);
        console.log("factors_arr1: " + factors_arr);
        factors_arr = factors_arr.map(Number);
        console.log("factors_arr1.2: " + factors_arr);
        function getSum(total, num) {
            return total + num;
        }
        factors_arr = factors_arr.reduce(getSum);
        console.log("factors_arr2: " + factors_arr);

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
        estimatedYears = (estimatedYears - CurrentAge)
        console.log("estimatedYears before factors: " + estimatedYears);
        /* estimatedYears = (estimatedYears - factors_arr);
        console.log("estimatedYears AFTER factors: " + estimatedYears); */
        year = (year + estimatedYears);
        reduce_years_arr = [];
        reduce_years_arr.push(year, factors_arr);
        console.log("reduce_years_array: " + reduce_years_arr);

        reduce_years_arr = reduce_years_arr.reduce(getSum);
        console.log("reduce_years_array2: " + reduce_years_arr);
        year = reduce_years_arr;

        //now reduce the factors from the aged
        reduce_age = [];
        reduce_age.push(AgeAtDeath, factors_arr);
        reduce_age = reduce_age.map(Number);
        console.log("reduce_age: " + reduce_age);
        reduce_age = reduce_age.reduce(getSum);
        console.log("reduce_age: " + reduce_age);
        AgeAtDeath = reduce_age;

        estimatedYears = (day + '/' + month + '/' + year);
        var calc_days = (year + '/' + 'month' + 'day');

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
        console.log("oneDay: " + oneDay + ' , firstDate:' + firstDate + ', secondDate:' + secondDate + ', diffDays:' + diffDays);
        //message if predicted date has passed already!
        if (parseInt(AgeAtDeath) < parseInt(CurrentAge)) {
            dead_yet = "<h4>Hang on, your supposed to be dead! 😲</h4>";
        } else {
            dead_yet = "<h4>You have <strong>" + diffDays + "</strong> days left to live, hows your bucket list looking?</h4>";
        }


        factors_table = "Overweight: " + Overweight + " years<br> Alcohol: " + Alcohol + " years<br> Smoking: " + Smoking + " years<br> Pollution: " + Pollution + " years<br> Exercise: " + Exercise + " years";

        //factors message
        if (factors_arr < 0) {
          factors_message = "<span class='glyphicon glyphicon-minus red'></span> Unfortunately due to your life conditions you have lost " + factors_arr + " years of your life:<br>" + factors_table;
        } else {
          factors_message = "<span class='glyphicon glyphicon-plus green'></span> Congratulations, due to the way have lived you have gained " + factors_arr + " years:<br>" + factors_table;
        }



        $.jAlert({
            'title': 'You will die on:',
            'content': '<h2>' + estimatedYears + ' aged ' + AgeAtDeath + '</h2><h3> Current age: ' + CurrentAge + '</h3>' + dead_yet + factors_message,
            'theme': 'black',
            'size': 'lg',
            'showAnimation': 'fadeInUp',
            'hideAnimation': 'fadeOutDown'
        });
    }; //end of click submit
    //end of data controller
});