"use strict";

const HIBP = require("../hibp");

// https://stackoverflow.com/a/8528531
function dhm(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  return [d, pad(h), pad(m)].join(':');
}


(async () => {
  const breaches = await HIBP.req("/breaches");

  let fastestResponseTime = Math.abs(new Date() - new Date(0));
  console.log("fastestResponseTime: ", fastestResponseTime);

  for (const breach of breaches.body) {
    const responseTime = Math.abs(new Date(breach.BreachDate) - new Date(breach.AddedDate));
    console.log("responseTime: ", responseTime);
    if (responseTime < fastestResponseTime) {
      console.log("new fastestResponseTime: ", fastestResponseTime);
      console.log("on breach: ", breach.Name);
      fastestResponseTime = responseTime;
    }
  }

  console.log(dhm(Math.abs(fastestResponseTime)));
})();

