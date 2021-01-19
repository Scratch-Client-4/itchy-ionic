// This file is a module that not only handles requests to the Scratch API, but also formats the results into useful data to be rendered by the dom.js module
// All of the functions here are asynchronous because we have to wait until a request is finished to send the result
let root = 'https://itchy-api.vercel.app';
// root = 'http://localhost:3000'; // for development, see micahlt/itchy-api on GitHub
// Get featured projects - the offset variable is the offset to send to the API endpoint
let getFeaturedProjects = async () => {
  // Define the array of project objects to return
  let toReturn = [];
  // Make an awaiting fetch call to our personal CORS proxy but limit the results to twenty
  await fetch(`${root}/api/frontpage?page=featured`)
    // Once the response has completed
    .then((response) => {
      // Convert the response to JSON
      return response.json();
      // Once the response has been converted
    }).then((data) => {
      // data is equal to the result of the return statement above
      // Loop through the response project objects
      for (let i = 0; i < 20; i++) {
        // Push an object to the toReturn array
        toReturn.push({
          // Set the id property to the project's ID
          id: data[i]['id'],
          // Set the title property to the project's title
          title: data[i]['title'],
          // Set the creator property to the project's author
          username: data[i]['creator']
        });
      }
    });
  // After all of the above have finished, return the toReturn project array
  return toReturn;
}

// Get top loved projects - the offset variable is the offset to send to the API endpoint
let getTopLovedProjects = async () => {
  // Define the array of project objects to return
  let toReturn = [];
  // Make an awaiting fetch call to our personal CORS proxy but limit the results to twenty
  await fetch(`${root}/api/frontpage?page=toploved`)
    // Once the response has completed
    .then((response) => {
      // Convert the response to JSON
      return response.json();
      // Once the response has been converted
    }).then((data) => {
      // data is equal to the result of the return statement above
      // Loop through the response project objects
      for (let i = 0; i < 20; i++) {
        // Push an object to the toReturn array
        toReturn.push({
          // Set the id property to the project's ID
          id: data[i]['id'],
          // Set the title property to the project's title
          title: data[i]['title'],
          // Set the creator property to the project's author
          user: data[i]['creator']
        });
      }
    });
  // After all of the above have finished, return the toReturn project array
  return toReturn;
}

// Get currently trending projects - the offset variable is the offset to send to the API endpoint
let getTrendingProjects = async (offset) => {
  offset = offset || 0;
  // Define the array of project objects to return
  let toReturn = [];
  // Make an awaiting fetch call to our personal CORS proxy but limit the results to twenty
  await fetch(`${root}/api/explore?offset=${offset}`)
    // Once the response has completed
    .then((response) => {
      // Convert the response to JSON
      return response.json();
      // Once the response has been converted
    }).then((data) => {
      // data is equal to the result of the return statement above
      // Loop through the response project objects
      for (let i = 0; i < 20; i++) {
        // Push an object to the toReturn array
        toReturn.push({
          // Set the id property to the project's ID
          id: data[i]['id'],
          // Set the title property to the project's title
          title: data[i]['title'],
          // Set the creator property to the project's author
          user: data[i]['author']['username']
        });
      }
    });
  // After all of the above have finished, return the toReturn project array
  return toReturn;
}

// Get recently shared projects - the offset variable is the offset to send to the API endpoint
let getRecentProjects = async (offset) => {
  offset = offset || 0;
  // Define the array of project objects to return
  let toReturn = [];
  // Make an awaiting fetch call to our personal CORS proxy but limit the results to twenty
  await fetch(`${root}/api/explore?mode=recent&offset=${offset}`)
    // Once the response has completed
    .then((response) => {
      // Convert the response to JSON
      return response.json();
      // Once the response has been converted
    }).then((data) => {
      // data is equal to the result of the return statement above
      // Loop through the response project objects
      for (let i = 0; i < 20; i++) {
        // Push an object to the toReturn array
        toReturn.push({
          // Set the id property to the project's ID
          id: data[i]['id'],
          // Set the title property to the project's title
          title: data[i]['title'],
          // Set the creator property to the project's author
          user: data[i]['author']['username']
        });
      }
    });
  // After all of the above have finished, return the toReturn project array
  return toReturn;
}

// Get projects of a certain tag - the offset variable is the offset to send to the API endpoint
let getTaggedProjects = async (tag, offset) => {
  offset = offset || 0;
  // Define the array of project objects to return
  let toReturn = [];
  // Make an awaiting fetch call to our personal CORS proxy but limit the results to twenty
  await fetch(`${root}/api/explore?offset=${offset}&tag=${tag}`)
    // Once the response has completed
    .then((response) => {
      // Convert the response to JSON
      return response.json();
      // Once the response has been converted
    }).then((data) => {
      // data is equal to the result of the return statement above
      // Loop through the response project objects
      for (let i = 0; i < 20; i++) {
        // Push an object to the toReturn array
        toReturn.push({
          // Set the id property to the project's ID
          id: data[i]['id'],
          // Set the title property to the project's title
          title: data[i]['title'],
          // Set the creator property to the project's author
          user: data[i]['author']['username']
        });
      }
    });
  // After all of the above have finished, return the toReturn project array
  return toReturn;
}

// Get search results from Qwant
// The query variable must be a string
let generalSearch = async (query, offset) => {
  offset = offset || 0;
  // Define the variable to store search result JSON
  let toReturn;
  // Make an awaiting fetch call to our personal CORS proxy but limit the results to ten (the maximum for Qwant)
  await fetch(`${root}/api/search?q=${query}&offset=${offset}`)
    // Once the response has competed
    .then((response) => {
      // Convert the response to JSON
      return response.json();
      // Once the response has been converted
    }).then((data) => {
      // Set toReturn equal to the returned data
      toReturn = data;
    });
  // Return the toReturn variable
  return toReturn;
}

let getProjectMetadata = async (id) => {
  // Define the project object to return
  let toReturn;
  // Make an awaiting fetch call to our personal CORS proxy but limit the results to twenty
  await fetch(`${root}/api/project?id=${id}`)
    // Once the response has completed
    .then((response) => {
      // Convert the response to JSON
      return response.json();
      // Once the response has been converted
    }).then((data) => {
      // data is equal to the result of the return statement above
      // Define data to return
      toReturn = {
        // Set the id property to the project's ID
        id: data['id'],
        // Set the title property to the project's title
        title: data['title'],
        // Set the username property to the project's author
        username: data['author']['username'],
        // Set the userId property to the project's author
        userId: data['author']['id']
      };
    });
  // After all of the above have finished, return the toReturn project object
  return toReturn;
}

let getProjectComments = async (id, offset) => {
  offset = offset || 0;
  // Define the project object to return
  let toReturn;
  // Make an awaiting fetch call to our personal CORS proxy but limit the results to twenty
  await fetch(`${root}/api/project?comments=true&commentoffset=${offset}&id=${id}`)
    // Once the response has completed
    .then((response) => {
      // Convert the response to JSON
      return response.json();
      // Once the response has been converted
    }).then((data) => {
      // data is equal to the result of the return statement above
      // Set toReturn equal to the data
      toReturn = data;
    });
  // After all of the above have finished, return the toReturn project object
  return toReturn;
}

let getUserPage = async (username) => {
  // Define the array of project objects to return
  let toReturn = [];
  // Make an awaiting fetch call to our personal CORS proxy but limit the results to twenty
  await fetch(`${root}/api/user?user=${username}`)
    // Once the response has completed
    .then((response) => {
      // Convert the response to JSON
      return response.json();
      // Once the response has been converted
    }).then((data) => {
      // data is equal to the result of the return statement above
      toReturn = data;
    });
  // After all of the above have finished, return the toReturn project array
  return toReturn;
}

let getUserComments = async (username) => {
  // Define the array of project objects to return
  let toReturn = [];
  // Make an awaiting fetch call to our personal CORS proxy but limit the results to twenty
  await fetch(`${root}/api/user?user=${username}&comments=true`)
    // Once the response has completed
    .then((response) => {
      // Convert the response to JSON
      return response.json();
      // Once the response has been converted
    }).then((data) => {
      // data is equal to the result of the return statement above
      toReturn = data;
    });
  // After all of the above have finished, return the toReturn project array
  return toReturn;
}

// Export all functions
module.exports = {
  projects: {
    recent: getRecentProjects,
    tagged: getTaggedProjects,
    trending: getTrendingProjects,
    topLoved: getTopLovedProjects,
    featured: getFeaturedProjects
  },
  search: {
    general: generalSearch
  },
  project: {
    metadata: getProjectMetadata,
    comments: getProjectComments
  },
  user: {
    metadata: getUserPage,
    comments: getUserComments
  }
}