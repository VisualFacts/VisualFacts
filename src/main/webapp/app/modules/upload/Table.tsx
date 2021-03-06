import React from 'react';
import HeadersCreator from './HeadersCreator';
import { Table, Checkbox, Dropdown, Form, Segment, Button, Loader, Grid, Divider, Icon } from 'semantic-ui-react';
import TableCellRowCreator from './TableCellRowCreator';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './upload-reducer';
import Map from './upmap';
import axios from 'axios';

export const TablePagination = () => {
  const uploadState = useSelector((state: Actions.RootState) => state.uploadState);
  const displayInfo = useSelector((state: Actions.RootState) => state.displayInfo);
  const dispatch = useDispatch();
  const coordinates = [];
  let options;
  if (uploadState.data.length !== 0) {
    options = !uploadState.checkbox
      ? uploadState.data[0].map((header, index) => ({ key: index, value: header, text: header }))
      : uploadState.data[0].map((header, index) => ({ key: index, value: `col(${index})`, text: `col(${index})` }));
  } else {
    options = [];
  }

  const filterOptions = numericCols => {
    let optionFil = [];
    if (numericCols !== null) {
      for (let i = 0; i < numericCols.length; i++) {
        if (
          options[numericCols[i]].value !== uploadState.dropdown1 &&
          options[numericCols[i]].value !== uploadState.dropdown2 &&
          options[numericCols[i]].value !== uploadState.dropdown3 &&
          options[numericCols[i]].value !== uploadState.dropdown4 &&
          uploadState.dropMultBox.includes(options[numericCols[i]].value) === false
        ) {
          optionFil.push(options[numericCols[i]]);
        }
      }
      return optionFil;
    } else {
      optionFil = options.reduce((filtered, option) => {
        if (
          option.value !== null &&
          option.value !== uploadState.dropdown1 &&
          option.value !== uploadState.dropdown2 &&
          option.value !== uploadState.dropdown3 &&
          option.value !== uploadState.dropdown4 &&
          uploadState.dropMultBox.includes(option.value) === false
        ) {
          option.text === false && (option.text = 'false');
          option.text === true && (option.text = 'true');
          filtered.push(option);
        }
        return filtered;
      }, []);
      return optionFil;
    }
  };

  const checkLatLon = (matrix, limit) => {
    let flag = false,
      temp = 0;
    const result = [];
    for (let i = 0; i < matrix[0].length; i++) {
      for (let y = 0; y < matrix.length; y++) {
        if (limit !== null) {
          if (matrix[y][i] < -limit || matrix[y][i] > limit || typeof matrix[y][i] !== 'number') {
            flag = true;
            y = matrix.length;
          }
        } else {
          if (typeof matrix[y][i] !== 'number') {
            flag = true;
            y = matrix.length;
          }
        }
      }
      if (flag === true) {
        flag = false;
      } else {
        if (limit === 180) {
          temp++;
          result.push(i);
          if (temp === 2) {
            break;
          }
        } else if (limit === 90) {
          result.push(i);
          break;
        } else {
          result.push(i);
        }
      }
    }
    return result;
  };

  const filterItems = (itemSearch, headers, matrix) => {
    let avoidnull;
    const query = itemSearch.toLowerCase();
    const res = headers.filter(item => {
      item !== null ? (avoidnull = item) : (avoidnull = '');
      return avoidnull.toString().toLowerCase().indexOf(query) >= 0;
    });
    if (res.length === 0) {
      itemSearch === 'lat' ? res.push(headers[checkLatLon(matrix, 90)[0]]) : res.push(headers[checkLatLon(matrix, 180)[1]]);
    }
    typeof matrix[0][headers.indexOf(res[0])] !== 'number' && (res[0] = '');
    res[0] === undefined && (res[0] = '');
    return res[0];
  };

  const handleChange = () => {
    dispatch(Actions.setHasHeader());
    dispatch(Actions.setBool(!uploadState.checkbox));
    dispatch(Actions.boolResetDisplay());
    dispatch(Actions.boolResetUpState());
  };

  const getCoordinates = () => {
    if (
      displayInfo.lon !== null &&
      displayInfo.lat !== null &&
      uploadState.trimData !== [] &&
      typeof uploadState.trimData[0][displayInfo.lat] === 'number' &&
      typeof uploadState.trimData[0][displayInfo.lon] === 'number'
    ) {
      for (let i = 0; i < uploadState.trimData.length; i++) {
        coordinates.push([uploadState.trimData[i][displayInfo.lat], uploadState.trimData[i][displayInfo.lon]]);
      }
      return coordinates;
    } else {
      return coordinates;
    }
  };

  const maxMinQuerryValues = (index, choice) => {
    const maxQuerry = Math.max(...uploadState.trimData.map(v => v[index]));
    const minQuerry = Math.min(...uploadState.trimData.map(v => v[index]));
    choice
      ? dispatch(Actions.setYQuery({ max: maxQuerry, min: minQuerry }))
      : dispatch(Actions.setXQuery({ max: maxQuerry, min: minQuerry }));
  };

  const dropdownLatLonChange = (name, choice) => {
    if (name) {
      const helpFind = element => {
        return element.value === name;
      };
      if (choice) {
        const found = options.find(helpFind);
        dispatch(Actions.setLat(found.key));
        maxMinQuerryValues(found.key, true);
      } else {
        const found = options.find(helpFind);
        dispatch(Actions.setLon(found.key));
        maxMinQuerryValues(found.key, false);
      }
    } else {
      choice ? dispatch(Actions.setLat(null)) : dispatch(Actions.setLon(null));
    }
  };

  const dropdownMeasureChange = (name, choice) => {
    if (name) {
      const helpFind = element => {
        return element.value === name;
      };

      const found = options.find(helpFind);
      choice === 0 ? dispatch(Actions.setMeasure0(found.key)) : dispatch(Actions.setMeasure1(found.key));
    } else {
      choice === 0 ? dispatch(Actions.setMeasure0(null)) : dispatch(Actions.setMeasure1(null));
    }
  };

  const multDropboxChange = name => {
    dispatch(Actions.emptyDimensions());
    name.map((nam, index) => {
      const helpFind = element => {
        return element.value === nam;
      };

      const found = options.find(helpFind);
      dispatch(Actions.setDimensions(found.key));
    });
  };

  const fileUpload = file => {
    const url = 'api/importData';
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    return axios.post(url, formData, config);
  };

  // PRESELECTION OF LAT AND LON VALUES
  if (uploadState.rend === false && uploadState.editButton === false) {
    dispatch(Actions.setDropbox1(filterItems('lat', uploadState.data[0], uploadState.trimData)));
    dropdownLatLonChange(filterItems('lat', uploadState.data[0], uploadState.trimData), true);
    dispatch(Actions.setDropbox2(filterItems('lon', uploadState.data[0], uploadState.trimData)));
    dropdownLatLonChange(filterItems('lon', uploadState.data[0], uploadState.trimData), false);
  }

  if (uploadState.rend === false) {
    dispatch(Actions.setRend(true));
    displayInfo.hasHeader === false && dispatch(Actions.setBool(true));
  }

  if (uploadState.rend === true && uploadState.trimData.length !== 0) {
    getCoordinates();
  }

  return (
    <div>
      {uploadState.data.length !== 0 ? (
        <>
          <Grid centered padded stackable>
            <Grid.Row>
              <Grid.Column floated="left">
                <Button
                  color="black"
                  onClick={() => {
                    dispatch(Actions.addData([]));
                    dispatch(Actions.setData([]));
                    dispatch(Actions.resetDropdowns());
                    dispatch(Actions.resetDisplay());
                    dispatch(Actions.fetchEntitiesList());
                    dispatch(Actions.setEditbutton(false));
                  }}
                >
                  Back
                </Button>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <div className="table_over">
                  <Table celled compact unstackable>
                    <Table.Header>
                      <Table.Row>
                        {uploadState.checkbox === false
                          ? uploadState.data[0].map((header, index) => <HeadersCreator header={header} key={index} />)
                          : uploadState.data[0].map((header, index) => <Table.HeaderCell key={index}>{`col(${index})`}</Table.HeaderCell>)}
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {uploadState.trimData.map((cellRow, index) => (
                        <TableCellRowCreator cellRow={cellRow} key={index} />
                      ))}
                    </Table.Body>
                  </Table>
                </div>
              </Grid.Column>
            </Grid.Row>
            <Divider />
            <Grid.Row columns="2">
              <Grid.Column width="3" textAlign="center">
                <div className="menu-content">
                  <div className="dropdowns">
                    <Form>
                      <Form.Field>
                        <Checkbox
                          className="checkbox"
                          slider
                          label="No Header"
                          checked={uploadState.checkbox}
                          onChange={handleChange}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Latitude</label>
                        <Dropdown
                          className="dropdown"
                          placeholder={uploadState.dropdown1}
                          search
                          clearable
                          selection
                          options={uploadState.data.length === 0 ? [] : filterOptions(null)}
                          value={uploadState.dropdown1}
                          onChange={(e, data) => {
                            dispatch(Actions.setDropbox1(data.value));
                            dropdownLatLonChange(data.value, true);
                          }}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Longitude</label>
                        <Dropdown
                          className="dropdown"
                          placeholder={uploadState.dropdown2}
                          search
                          clearable
                          selection
                          options={uploadState.data.length === 0 ? [] : filterOptions(null)}
                          value={uploadState.dropdown2}
                          onChange={(e, data) => {
                            dispatch(Actions.setDropbox2(data.value));
                            dropdownLatLonChange(data.value, false);
                          }}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Measures</label>
                        <Dropdown
                          className="dropdown"
                          placeholder={uploadState.dropdown3}
                          search
                          clearable
                          selection
                          options={uploadState.data.length === 0 ? [] : filterOptions(checkLatLon(uploadState.data.slice(1, 50), null))}
                          value={uploadState.dropdown3}
                          onChange={(e, data) => {
                            dispatch(Actions.setDropbox3(data.value));
                            dropdownMeasureChange(data.value, 0);
                          }}
                        />
                        <Divider hidden />
                        <Dropdown
                          className="dropdown"
                          placeholder={uploadState.dropdown4}
                          search
                          clearable
                          selection
                          options={uploadState.data.length === 0 ? [] : filterOptions(checkLatLon(uploadState.data.slice(1, 50), null))}
                          value={uploadState.dropdown4}
                          onChange={(e, data) => {
                            dispatch(Actions.setDropbox4(data.value));
                            dropdownMeasureChange(data.value, 1);
                          }}
                        />
                      </Form.Field>
                      {/* <Form.Field>
                        <label>MeasuresNEW</label>
                        <Dropdown
                          className="dropdown"
                          multiple
                          placeholder={`${uploadState.dropdown3}, ${uploadState.dropdown4}`}
                          search
                          selection
                          value={[uploadState.dropdown3, uploadState.dropdown4]}
                          options={filterOptions(checkLatLon(uploadState.data.slice(1, 50), null)).length === 0 ? options : filterOptions(checkLatLon(uploadState.data.slice(1, 50), null))}
                          onChange={(e, data) => {
                            console.log(data.value);
                              data.value[0] && (dispatch(Actions.setDropbox3(data.value[0])),
                              dropdownMeasureChange(data.value[0], 0));

                              data.value[1] &&  (dispatch(Actions.setDropbox4(data.value[1])),
                              dropdownMeasureChange(data.value[1], 1));
                          }}
                        />
                      </Form.Field> */}
                      <Form.Field>
                        <label>Dimensions</label>
                        <Dropdown
                          className="dropdown"
                          multiple
                          placeholder={uploadState.dropMultBox.toString()}
                          search
                          selection
                          value={uploadState.data.length === 0 ? [] : uploadState.dropMultBox}
                          options={uploadState.data.length === 0 ? [] : options}
                          onChange={(e, data) => {
                            dispatch(Actions.setDropMultBox(data.value));
                            multDropboxChange(data.value);
                          }}
                        />
                      </Form.Field>
                      <Button
                        color="blue"
                        onClick={() => {
                          uploadState.editButton === false && fileUpload(uploadState.originalFile);
                          dispatch(Actions.createEntity(displayInfo));
                        }}
                      >
                        <Icon name="save outline" />
                        Save
                      </Button>
                    </Form>
                  </div>
                </div>
              </Grid.Column>
              <Grid.Column width="7" stretched>
                <Segment piled basic>
                  <Map Coordinates={coordinates} />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      ) : (
        <>
          <Grid centered>
            <Segment vertical>
              <Loader active inline="centered" size="massive">
                Fetching Data
              </Loader>
            </Segment>
          </Grid>
        </>
      )}
    </div>
  );
};
