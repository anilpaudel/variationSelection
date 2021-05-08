const getVariation = (variationList) => {
  let variationNewList = {};
  let variationArray = [];
  variationList.forEach((variationObject) => {
    variationObject.variationData.forEach((item) => {
      if (variationNewList[item.variationName]) {
        variationNewList[item.variationName].add(item.variationValue);
      } else {
        variationArray.push(item.variationName);
        variationNewList[item.variationName] = new Set();
        variationNewList[item.variationName].add(item.variationValue);
      }
    });
  }); 
  for (var key in variationNewList) {
    variationNewList[key] = [...variationNewList[key]];
  }
  return { variationNewList, variationArray };
};

const populateList = (filterObject, attributeName, attributeValue) => {};

const dePopulateList = (filterObject, attributeName) => {};

const getInitialObject = (variationCombo) => {
  let initialObject = [];
  for (var key in variationCombo) {
    variationCombo[key].forEach((item) => {
      initialObject.push({
        variationName: key,
        variationValue: item,
        selectionStatus: false,
        availableStatus: true,
      });
    });
  }
  return initialObject;
};

const getFilteredVariation = (filterObject, variationList) => {
  let returnData = variationList.filter((variationObject) => {
    let i;
    for (var key in filterObject) {
      let found = false;
      for (i = 0; i < variationObject.variationData.length; i++) {
        if (
          key == variationObject.variationData[i].variationName &&
          filterObject[key] == variationObject.variationData[i].variationValue
        ) {
          found = true;
          break;
        }
      }
      if (found == false) {
        return false;
      }
    }
    return true;
  });
  return returnData;
};

const getUpdatedInitialObject = (
  initialObject,
  filterObject,
  updatedVariationList
) => {
  console.log("updated ", updatedVariationList);
  return initialObject.map((item) => {
    let selection = false;
    let available = true;
    let isbreaked = false;
    for (var key in filterObject) {
      if (key == item.variationName) {
        available = false;
        if (filterObject[key] == item.variationValue) {
          available=true;
          selection = true;
        }
        isbreaked = true;
        break;
      }
    }
    if (!isbreaked) {
      let i;
      available = false;
      for (var listKey in updatedVariationList) {
        for (i = 0; i < updatedVariationList[listKey].length; i++) {
          console.log("item and value  are", updatedVariationList[listKey]);
          if (
            item.variationName == listKey &&
            item.variationValue == updatedVariationList[listKey][i]
          ) {
            available = true;
            break;
          }
        }
        if (available) {
          break;
        }
      }
    }
    return {
      ...item,
      selectionStatus: selection,
      availableStatus: available,
    };
  });
};

export default {
  getVariation,
  populateList,
  dePopulateList,
  getInitialObject,
  getFilteredVariation,
  getUpdatedInitialObject,
};
