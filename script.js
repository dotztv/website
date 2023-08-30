console.log("Hello World!")

let count = 0;

const increment = () => {
  count++;
  console.log("This website has been loaded on your browser for = " + count + " Seconds!");
};

setInterval(increment, 1000);
