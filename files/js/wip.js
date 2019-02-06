factors_arr = [-2, -2, -2, -2, +2];
console.log("factors_arr1: " + factors_arr);

function getSum(total, num) {
    return total + num;
  }

  factors_arr = factors_arr.reduce(getSum);

  console.log("factors_arr2: " + factors_arr);