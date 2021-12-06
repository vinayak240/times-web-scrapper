const getElementEnd = (startIdx, docStr, tagName) => {
  let eleEndIdx = -1;
  let sameEleCount = 1;
  let endTag = `</${tagName}>`;
  let startTag = `<${tagName}`;
  do {
    let sameEleIdx = docStr.indexOf(startTag, startIdx);
    if (
      sameEleIdx !== -1 &&
      !checkIfNextTag(docStr.slice(startIdx, sameEleIdx), endTag)
    ) {
      sameEleCount += 1;
    }

    eleEndIdx = docStr.indexOf(endTag, startIdx);
    if (eleEndIdx !== -1) {
      sameEleCount -= 1;
      startIdx = eleEndIdx + endTag.length;
    }
  } while (sameEleCount > 0);

  return eleEndIdx;
};

const checkIfNextTag = (docStr, endTag) => {
  return docStr.includes(endTag);
};

const getElementStartByTagName = (tagName, docStr) => {
  let startTag = `<${tagName}`;
  let startIdx = docStr.indexOf(startTag);
  return docStr.indexOf(">", startIdx) + 1;
};

const getElementStartByClassName = (className, docStr) => {
  let startIdx = docStr.indexOf(className);
  return docStr.indexOf(">", startIdx) + 1;
};

const getElementAttributeValue = (eleStr, attrName, tagName) => {
  let re = `${attrName}=(.*)`;
  re = new RegExp(re, "g");
  let startTag = `<${tagName}`;
  let start = eleStr.indexOf(startTag);
  let end = eleStr.indexOf(">", start);
  let attrStr = eleStr.slice(start, end);

  return re.exec(attrStr)[1];
};

module.exports = {
  getElementEnd,
  checkIfNextTag,
  getElementStartByTagName,
  getElementStartByClassName,
  getElementAttributeValue,
};
