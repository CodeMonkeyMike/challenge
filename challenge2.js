// Scan till you find the last two consecutive numbers that add up less then the gift card
// If the first pair is more then the gift card then return "not possible"
// At the point were you find the pair (a, b) increment b by 1 and check all possibilities from a -> 0
// for a pair that is less then the price of the gift card
// Continue till b has no pair that matches with it that will be less then the cost of the gift card

const readline = require('readline')
const fs = require('fs')

function main(file, giftcard) {
  let prevItem = {'price': 0, 'name': null}
  let currItem = {'price': 0, 'name': null}
  let bestChoice = {
    'first': {'price': 0, 'name': null},
    'second': {'price': 0, 'name': null}
  }

  const rl = readline.createInterface({
    input: fs.createReadStream(file)
  });
  // Iterate through the file line by line using previous and current lines
  // save the best choice for the gift card until either the prev and curr lines
  // are more then the cost of the gift card or equal
  // If equal we are done if not then we start our second pass through the data
  // starting at the current value which was more then the gift card when combined
  // with the previous value in the data
  const firstPass = (line) => {
    currItem = parseItemFromLine(line)
    if (prevItem['price'] + currItem['price'] > giftcard) {
      rl.pause()
    } else if (prevItem['price'] + currItem['price'] === giftcard) {
      bestChoice = {'first': prevItem, 'second': currItem}
      rl.close()
    } else {
      if ((prevItem['price'] + currItem['price']) >
        (bestChoice['first']['price'] + bestChoice['second']['price'])) {
        bestChoice = {'first': prevItem, 'second': currItem}
      }
    }
    prevItem = currItem
  }

  // With a current value that is more then the price of the gift card when combined with
  // the item less pricey but most close to it in value we go through all the items starting
  // from the least costly to the most updating the best choice for our gift card when applicable
  // and ending the search when the combined price of the current value from the first pass is more
  // than the current value of the second pass
  const secondPass = () => {
    const rl2 = readline.createInterface({
      input: fs.createReadStream(file)
    });
    let signalDone = false
    let staticItem = currItem
    rl2.on('line', (line) => {
      innerItem = parseItemFromLine(line)
      if (innerItem['price'] + staticItem['price'] > giftcard) {
        rl2.close()
      } else if (innerItem['price'] + staticItem['price'] === giftcard) {
        bestChoice = {'first': innerItem, 'second': staticItem}
        signalDone = true
        rl2.close()
      } else {
        if ((innerItem['price'] + staticItem['price']) >
          (bestChoice['first']['price'] + bestChoice['second']['price'])) {
          bestChoice = {'first': innerItem, 'second': staticItem}
        }
      }
    }).on('close', () => {
      if (signalDone) {
        rl.close()
      } else {
        rl.resume()
      }
    })
  } 

  rl.on('line', firstPass)
    .on('pause', secondPass)
    .on('close', () => {
      if (bestChoice['first']['name'] === null) {
        console.log('Not Possible')
      } else {
        console.log(bestChoice)
      }
    });
}

function parseItemFromLine(line) {
  return {
    'price': parseInt(line.split(',')[1].trim(), 10),
    'name': line.split(',')[0].trim()
  }
}
// argv 0 should be node and argv 1 should be the file name
main(process.argv[2], process.argv[3])
