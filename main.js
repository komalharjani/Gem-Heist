function makeCounter() {
  var count = 0;
  var counter = {
    getCount: function() {
      return count;
    },
    increment: function() {
      count++;
    }
  }
  return counter;
}
var myCounter = makeCounter()

class Horse {
constructor(){
  let hair=0;
  this.getHair=function(){
    return hair;
  }
  this.increment=function(){
    hair++;
  }
  this.color='black';
  this.height='1.80';
}



}
