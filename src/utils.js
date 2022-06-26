import { Http } from "@capacitor-community/http";
const approx = require("./approximate-number.js");

function replaceEmoji(string) {
  const namesToReplace = {
    "meow.png": "😺",
    "gobo.png": "[gobo emoji]",
    "waffle.png": "🧇",
    "taco.png": "🌮",
    "sushi.png": "🍣",
    "apple.png": "🍎",
    "broccoli.png": "🥦",
    "pizza.png": "🍕",
    "candycorn.png": "[candycorn emoji]",
    "10mil.png": "🎉",
    "map.png": "🗺️",
    "camera.png": "📷",
    "suitcase.png": "💼",
    "compass.png": "🧭",
    "binoculars.png": "🔭",
    "cupcake.png": "🧁",
    "cat.png": "🐱",
    "aww-cat.png": "😀",
    "cool-cat.png": "😎",
    "tongue-out-cat.png": "😛",
    "wink-cat.png": "😜",
    "lol-cat.png": "😹",
    "upside-down-cat.png": "🙃",
    "huh-cat.png": "🤨",
    "love-it-cat.png": "😻",
    "fav-it-cat.png": "🤩",
    "rainbow-cat.png": "😸🌈",
    "pizza-cat.png": "😸🍕",
    "blm.png": "✊🏿",
    "pride.png": "🏳️‍🌈",
  };
  Object.keys(namesToReplace).forEach((emoji) => {
    string = string.replaceAll(
      `<img src="/images/emoji/${emoji}" class="emoji" alt="${emoji.substring(
        0,
        emoji.length - 4
      )} emoji">`,
      namesToReplace[emoji]
    );
  });
  return string;
}

function matchRegexes(string) {
  let numberPattern = new RegExp(`\\d+`, `g`);
  let projectRegex = new RegExp(
    `.(\\/scratch.mit.edu/projects/)[0-9]\\d*`,
    `g`
  );
  let studioRegex = new RegExp(`.(\\/scratch.mit.edu/studios/)[0-9]\\d*`, `g`);
  let userRegex = new RegExp(`.(\\/scratch.mit.edu/users/)\\w*`, `g`);
  if (string.match(projectRegex)) {
    console.log(string.match(projectRegex)[0]);
    let id = string.match(projectRegex)[0];
    id = id.match(numberPattern)[0];
    return {
      type: "project",
      id: id,
    };
  } else if (studioRegex.test(string)) {
    console.log(`${string} is a link to a studio`);
    return {
      type: "studio",
      id: 123456,
    };
  } else if (string == "https://scratch.mit.edu/") {
    return {
      type: "homepage",
    };
  } else if (string.match(userRegex)) {
    let username = string.match(userRegex)[0];
    username = username.split("//scratch.mit.edu/users/")[1];
    username = username.split("/")[0];
    return {
      type: "user",
      id: username,
    };
  } else {
    return null;
  }
}

function prepareText(str) {
  let proto = str;
  proto = proto.split("<").join("&lt;").split(">").join("&gt;");
  proto = proto.replace(/(\n)+/g, " <br /> ");
  proto = proto.replace(/(\n)+/g, " <br> ");
  proto = proto.split(" ");
  let toReturn = "";
  proto.forEach((word) => {
    let reg = matchRegexes(word);
    if (reg) {
      toReturn += `<a href="/?${reg.type}=${reg.id}">${reg.type}:${reg.id}</a>`;
    } else {
      toReturn += `${word} `;
    }
  });
  return toReturn;
}

function getParams(url) {
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
}

var decodeEntities = (function () {
  // this prevents any overhead from creating the object each time
  var element = document.createElement("div");

  function decodeHTMLEntities(str) {
    if (str && typeof str === "string") {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "");
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "");
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = "";
    }
    return str;
  }

  return decodeHTMLEntities;
})();

var formatDate = (dateString) => {
  const date = new Date(dateString);
  const m = date.getMonth() + 1; // stupid zero-indexed months
  const d = date.getDate();
  const y = date.getFullYear();
  return `${m}/${d}/${y}`;
};

var formatNumber = (number) => {
  return approx(number);
};

let searchResultProto = {
  title: "String",
  type: "Project/Studio/User",
  id: 1234567,
  image: "url",
};

async function unifiedSearch(query, offset) {
  var results = [];
  query = encodeURI(query);
  const doRequests = async () => {
    if (offset == 0) {
      var user = await Http.request({
        method: "GET",
        url: `https://api.scratch.mit.edu/users/${query}`,
      });
      var secondUser = await Http.request({
        method: "GET",
        url: `https://api.scratch.mit.edu/users/-${query}-`,
      });
      if (user.status == 200) {
        results.push({
          title: user.data.username,
          type: "User profile",
          id: user.data.id,
          image: user.data.profile.images["50x50"],
        });
      }
      if (secondUser.status == 200) {
        results.push({
          title: secondUser.data.username,
          type: "User profile",
          id: secondUser.data.id,
          image: secondUser.data.profile.images["50x50"],
        });
      }
    }
    var projects = await Http.request({
      method: "GET",
      url: `https://api.scratch.mit.edu/search/projects?limit=10&offset=${offset}&language=en&mode=popular&q=${query}`,
    });
    if (projects.status == 200) {
      projects.data.forEach((item) => {
        results.push({
          title: item.title,
          type: `Project by ${item.author.username}`,
          id: item.id,
          image: item.images["100x80"],
        });
      });
    }
    var studios = await Http.request({
      method: "GET",
      url: `https://api.scratch.mit.edu/search/studios?limit=10&offset=${offset}&language=en&mode=popular&q=${query}`,
    });
    if (studios.status == 200) {
      studios.data.forEach((item) => {
        results.push({
          title: item.title,
          type: `Studio`,
          id: item.id,
          image: item.image,
        });
      });
    }
  };
  await doRequests();
  return results;
}

export {
  replaceEmoji,
  matchRegexes,
  prepareText,
  getParams,
  decodeEntities,
  unifiedSearch,
  searchResultProto,
  formatDate,
  formatNumber,
};
