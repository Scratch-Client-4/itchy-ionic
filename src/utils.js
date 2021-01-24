function matchRegexes(string) {
  let numberPattern = new RegExp(`\\d+`, `g`);
  let projectRegex = new RegExp(`.(\\/scratch.mit.edu/projects/)[0-9]\\d*`, `g`);
  let studioRegex = new RegExp(`.(\\/scratch.mit.edu/studios/)[0-9]\\d*`, `g`);
  if (string.match(projectRegex)) {
    console.log(`${string} is a link to a project`);
    console.log(string.match(projectRegex)[0])
    let id = string.match(projectRegex)[0];
    id = id.match(numberPattern)[0];
    return {
      type: "project",
      id: id
    };
  } else if (studioRegex.test(string)) {
    console.log(`${string} is a link to a studio`);
    return {
      type: "studio",
      id: 123456
    };
  } else {
    return null;
  }
}

function prepareText(str) {
  let proto = str;
  proto = proto.split("<").join("&lt;").split(">").join("&gt;");
  proto = proto.replace(/(\n)+/g, ' <br /> ');
  proto = proto.split(" ");
  let toReturn = "";
  proto.forEach((word) => {
    let reg = matchRegexes(word);
    if (reg) {
      toReturn += `<a href="/tabs/tab1?${reg.type}=${reg.id}">${reg.type}:${reg.id}</a>`
    } else {
      toReturn += `${word} `;
    }
  })
  return toReturn;
}

var getParams = function(url) {
  // set up the getParams function
  var params = {}; // set up a params object
  var parser = document.createElement("a"); // create a link parse
  parser.href = url; // set the parser's href to the url passed to the function
  var query = parser.search.substring(1); // query the string
  var vars = query.split("&"); // split the parameters with an ampersand
  for (var i = 0; i < vars.length; i++) {
    // loop through the string
    var pair = vars[i].split("="); // split into multiple params
    params[pair[0]] = decodeURIComponent(pair[1]); // decode the component
  }
  return params; // return the parameters as an object
};

export {
  matchRegexes,
  prepareText,
  getParams
}