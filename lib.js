const { TIME_URL } = require("./constants");
const { httpGet, parseStories } = require("./utils");

const fetchTimeStores = async () => {
  try {
    const response = await httpGet(TIME_URL);
    let stories = parseStories(response);
    return stories;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { fetchTimeStores };
