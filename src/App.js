import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import variationFunction from "./variationfunction";
import variationData from "./variationData";

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function CheckboxLabels() {
  const handleChangeValue = (event, item) => {
    console.log(item);
    if (event.target.checked) {
      setFilterObject({
        ...filterObject,
        [item.variationName]: item.variationValue,
      });
    } else {
      let oldFilterObject = { ...filterObject };
      delete oldFilterObject[item.variationName];
      // _.omit(oldFilterObject,item.variationName)
      setFilterObject(oldFilterObject);
    }
  };

  const [variationList, setVariationList] = useState([]);
  const [initialObject, setInitialObject] = useState([]);
  const [filterObject, setFilterObject] = useState({});
  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5050/api/v1/product/608e0d133700764e892f1b3f")
      .then((res) => res.json())
      .then((response) => {
        if (response.data && response.data.productVariations) {
          let variationSource = variationData.variationList;
          //let variationSource= response.data.productVariations

          let variationCombo = variationFunction.getVariation(variationSource);
          let initialObject = variationFunction.getInitialObject(
            variationCombo.variationNewList
          );
          setSelectedVariation(variationSource[0]);
          setVariationList(variationSource);
          setInitialObject(initialObject);
          console.log(
            variationFunction.getVariation(response.data.productVariations)
          );
        }
      });
  }, []);

  useEffect(() => {
    let filteredVariation = variationFunction.getFilteredVariation(
      filterObject,
      variationList
    );

    let filteredVariationCombo = variationFunction.getVariation(
      filteredVariation
    );
    let updatedInitialObject = variationFunction.getUpdatedInitialObject(
      initialObject,
      filterObject,
      filteredVariationCombo.variationNewList
    );

    setSelectedVariation(filteredVariation ? filteredVariation[0] : null);

    setInitialObject(updatedInitialObject);
  }, [filterObject]);

  return (
    <FormGroup row>
      {initialObject.map((item) => {
        return (
          <FormControlLabel
            control={
              <Checkbox
                disabled={!item.availableStatus}
                checked={item.selectionStatus}
                data="33"
                onChange={(event) => handleChangeValue(event, item)}
                name={item._id}
              />
            }
            label={item.variationValue}
          />
        );
      })}


    </FormGroup>
  );
}
