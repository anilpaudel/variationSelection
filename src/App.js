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
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true,
  });

  const handleChange = (event) => {
    console.log("filtered object is ", filterObject);
    console.log("initial object is ", initialObject);

    console.log("the selected variation is ", selectedVariation);

    return setState({ ...state, [event.target.name]: event.target.checked });
  };

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
    // return   setState({ ...state, [event.target.name]: event.target.checked });
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
          let variationCombo = variationFunction.getVariation(
            variationData.variationList
          );
          let initialObject = variationFunction.getInitialObject(
            variationCombo.variationNewList
          );
          setSelectedVariation(variationData.variationList[0]);
          setVariationList(variationData.variationList);
          setInitialObject(initialObject);
          console.log(
            variationFunction.getVariation(response.data.productVariations)
          );
        }
      });
  }, []);

  useEffect(() => {
    console.log("filter object is ", filterObject);
    console.log("variationList is", variationList);
    let filteredVariation = variationFunction.getFilteredVariation(
      filterObject,
      variationList
    );

    console.log("filtered variation is ", filteredVariation);
    let filteredVariationCombo = variationFunction.getVariation(
      filteredVariation
    );
    console.log("filtered variation comnbo is ", filteredVariationCombo);
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
      <FormControlLabel
        control={
          <Checkbox
            checked={state.checkedA}
            onChange={handleChange}
            name="checkedA"
            names="checkedA"
          />
        }
        label="Secondary"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.checkedB}
            onChange={handleChange}
            name="checkedB"
            color="primary"
          />
        }
        label="Primary"
      />
      <FormControlLabel
        control={<Checkbox name="checkedC" />}
        label="Uncontrolled"
      />
      <FormControlLabel
        disabled
        control={<Checkbox name="checkedD" />}
        label="Disabled"
      />
      <FormControlLabel
        disabled
        control={<Checkbox checked name="checkedE" />}
        label="Disabled"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={state.checkedF}
            onChange={handleChange}
            name="checkedF"
            indeterminate
          />
        }
        label="Indeterminate"
      />
      <FormControlLabel
        control={
          <GreenCheckbox
            checked={state.checkedG}
            onChange={handleChange}
            name="checkedG"
          />
        }
        label="Custom color"
      />
      <FormControlLabel
        control={
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            name="checkedH"
          />
        }
        label="Custom icon"
      />
      <FormControlLabel
        control={
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            name="checkedI"
          />
        }
        label="Custom size"
      />
    </FormGroup>
  );
}
