// Challenge #3

// for an input with n number of x's there are 2^n possible outputs or 
// permutations. This problem can be solved by looping 2^n times and
// filling in the x's with the binary representation of the loop variable

// This function has a time complexity of O(2^n)

function replaceX(string) {
  // Overkill, but assumes you are sending numbers and x's only
  xCount = string.replace(/[0-9]/g, '').length
  // Permutations is 2^n where n is number of x's
  let permutations = Math.pow(2, xCount)
  for (let i = 0; i < permutations; i++) {
    let binaryForm = i.toString(2).padStart(xCount, 0)
    let newString = string;
    // Replace the x's in the string with the 1's and 0's 
    // from the binary representation of the iteration variable
    binaryForm.split('').forEach((character) => {
      newString = newString.replace('X', character)
    })
    console.log(newString)
  }
}

replaceX(process.argv[2])
