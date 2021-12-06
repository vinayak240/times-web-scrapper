const { get } = require("https");
const {
  CLS_NM,
  TITLE_ELE_TREE,
  LINK_ELE_TREE,
  N_STORIES,
  TIME_URL,
} = require("./constants");

const {
  getElementEnd,
  getElementStartByTagName,
  getElementStartByClassName,
  getElementAttributeValue,
} = require("./dom_parsers");

const httpGet = (url) => {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", (data) => (body += data));
      res.on("end", () => resolve(body));
    }).on("error", reject);
  });
};

const parseStories = (content) => {
  let sectionStart = getElementStartByClassName(CLS_NM, content);
  let sectionEnd = getElementEnd(sectionStart, content, "section");
  let isMul = false;
  let titleTree = TITLE_ELE_TREE.split("/");
  let linkTree = LINK_ELE_TREE.split("/");

  let parsedStories = getSubContent(
    titleTree,
    content.slice(sectionStart, sectionEnd),
    isMul
  );

  return parsedStories.map((story) => {
    return {
      title: getElementContent(titleTree[titleTree.length - 1], "a", story),
      link: `${TIME_URL}${getElementContent(
        linkTree[linkTree.length - 1],
        "a",
        story
      )}`,
    };
  });
};

const getElementContent = (node, tagName, content) => {
  if (node.includes("[text]")) {
    let start = getElementStartByTagName(tagName, content);
    let end = getElementEnd(start, content, tagName);
    return content.slice(start, end);
  } else if (node.includes("[attr=")) {
    return getElementAttributeValue(content, "href", tagName);
  }
};

const getSubContent = (eleTree, content, isMul = false) => {
  let subContent = content;

  if (eleTree.length === 1) {
    return content;
  }

  let resElements = [];
  for (let i = 0; i < eleTree.length - 1; i++) {
    let tag = eleTree[i];
    if (tag.includes("(n)")) {
      tag = tag.slice(0, tag.length - 3);
      isMul = true;
    }
    let start = -1;
    let end = -1;
    if (isMul) {
      let tempContent = subContent;
      for (let j = 0; j < N_STORIES; j++) {
        start = getElementStartByTagName(tag, tempContent);
        end = getElementEnd(start, tempContent, tag);
        let result = getSubContent(
          eleTree.slice(i + 1, eleTree.length),
          tempContent.slice(start, end)
        );
        tempContent = tempContent.slice(
          end + tag.length + 3,
          tempContent.length
        );

        resElements.push(result);
      }
      eleTree = eleTree.slice(0, i + 1);
    } else {
      start = getElementStartByTagName(tag, subContent);
      end = getElementEnd(start, subContent, tag);
      subContent = subContent.slice(start, end);
    }
  }

  return isMul ? resElements : subContent;
};

module.exports = { httpGet, getElementEnd, parseStories };
