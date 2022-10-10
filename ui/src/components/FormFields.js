import {
  TextField,
  Grid,
  Typography,
  Divider,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { useRef, useState } from 'react';
import moment from 'moment';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import counties from '../data/counties.json';
import countyToConstituency from '../data/constituencies.json';
import consituencyToWard from '../data/wards.json';
import { addDays } from 'date-fns';
import malariaContacts from '../data/malariaProphylaxisContacts.json';
import ifasOptions from '../data/ifas.json';
import * as yup from 'yup';

export default function FormFields({ formik, formData, encounters, ...props }) {
  const isMobile = useMediaQuery('(max-width:600px)');

  const [dateProps, setDateProps] = useState({ disabled: true });

  const sections = Object.keys(formData);
  const inputRef = useRef(null);

  const handleChangeSelect = (e, field, section, idx) => {
    if (field.name === 'county') {
      const countyCode = counties.find(
        item => item.name === e.target.value
      ).code;
      const subCountyOptions = countyToConstituency
        .filter(item => item.county_code == countyCode)
        ?.map(item => ({
          label: item.name,
          value: item.name,
        }));
      formData[section][idx + 1].options = subCountyOptions;
    }
    if (field.name === 'subCounty') {
      const constituencyCode = countyToConstituency.find(
        item => item.name === e.target.value
      ).code;
      const wardOptions = consituencyToWard
        .filter(item => item.constituency_code == constituencyCode)
        ?.map(item => ({
          label: item.name,
          value: item.name,
        }));
      formData[section][idx + 1].options = wardOptions;
    }
    if (field.name === 'timingOfContact') {
      formData[section][idx + 1].label = malariaContacts[e.target.value];
    }
    if (field.name === 'ancContact') {
      formData[section][idx + 1].content = e.target.value;
      formData[section][idx + 2].content = ifasOptions[e.target.value];
    }
    formik.setFieldValue(field.name, e.target.value);
  };

  const handleChangeChecked = (e, field, option) => {
    if (e.target.checked) {
      formik.setFieldValue(
        field.name,
        formik.values[field.name].concat(option.value)
      );
    } else {
      formik.setFieldValue(
        field.name,
        formik.values[field.name].filter(item => item !== option.value)
      );
    }
    console.log(field.name + ':', formik.values[field.name]);
  };

  const handleInputChange = (e, field, section) => {
    formik.setFieldValue(field.name, e.target.value);

    if (field.name === 'systolicBp') {
      const currentInput = document.querySelector(
        `input[name="${field.name}"]`
      );
      // get label element for the current input
      const currentDiv = currentInput.parentNode;
      const currentLabel = currentDiv.parentNode.querySelector('label');

      currentLabel.style.color = 'black';
      currentLabel.style.zIndex = '100';
      currentLabel.style.background = 'rgba(255, 255, 255,0.8)';
      currentLabel.style.margin = '0';
      currentLabel.style.borderRadius = '2px';

      if (e.target.value < 71) {
        currentInput.style.backgroundColor = '#d00000';
        currentInput.style.color = 'white';
      } else if (e.target.value < 81) {
        currentInput.style.backgroundColor = '#f48c06';
        currentInput.style.color = 'black';
      } else if (e.target.value < 110) {
        currentInput.style.backgroundColor = '#ffd60a';
        currentInput.style.color = 'black';
      } else if (e.target.value < 140) {
        currentInput.style.backgroundColor = '#80ed99';
        currentInput.style.color = 'black';
      } else {
        currentInput.style.backgroundColor = '#d00000';
      }
    }

    if (field.name === 'diastolicBp') {
      const currentInput = document.querySelector(
        `input[name="${field.name}"]`
      );
      if (e.target.value <= 60) {
        currentInput.style.backgroundColor = '#ffd60a';
        currentInput.style.color = 'black';
      }
      if (e.target.value < 91 && e.target.value > 60) {
        currentInput.style.backgroundColor = '#80ed99';
        currentInput.style.color = 'black';
      }
      if (e.target.value > 90) {
        currentInput.style.backgroundColor = '#d00000';
        currentInput.style.color = 'white';
      }
    }

    if (field.name === 'pulseRate') {
      const currentInput = document.querySelector(
        `input[name="${field.name}"]`
      );
      if (e.target.value < 60) {
        currentInput.style.backgroundColor = '#d00000';
        currentInput.style.color = 'white';
      }
      if (e.target.value < 101 && e.target.value > 59) {
        currentInput.style.backgroundColor = '#80ed99';
        currentInput.style.color = 'black';
      }
      if (e.target.value < 140 && e.target.value > 100) {
        currentInput.style.backgroundColor = '#ffd60a';
        currentInput.style.color = 'black';
      }

      if (e.target.value > 140) {
        currentInput.style.backgroundColor = '#d00000';
        currentInput.style.color = 'white';
      }
    }

    if (field.name === 'gestationalAge') {
      let nextVisitDate = formik.values.nextVisitDate;
      let gestationalAge = Number(e.target.value);
      switch (true) {
        case gestationalAge < 20 && encounters.length === 0:
          nextVisitDate = moment().add(8, 'weeks').format('YYYY-MM-DD');

          break;
        case gestationalAge < 20 && encounters.length > 0:
          nextVisitDate = moment(
            encounters[encounters.length - 1].resource.period.start
          )
            .add(8, 'weeks')
            .format('YYYY-MM-DD');

          break;
        case gestationalAge >= 20 &&
          gestationalAge < 26 &&
          encounters.length === 0:
          nextVisitDate = moment().add(6, 'weeks').format('YYYY-MM-DD');

          break;
        case gestationalAge >= 20 &&
          gestationalAge < 26 &&
          encounters.length > 0:
          nextVisitDate = moment(
            encounters[encounters.length - 1].resource.period.start
          )
            .add(6, 'weeks')
            .format('YYYY-MM-DD');

          break;
        case gestationalAge >= 26 &&
          gestationalAge < 34 &&
          encounters.length === 0:
          nextVisitDate = moment().add(4, 'weeks').format('YYYY-MM-DD');

          break;
        case gestationalAge >= 26 &&
          gestationalAge < 34 &&
          encounters.length > 0:
          nextVisitDate = moment(
            encounters[encounters.length - 1].resource.period.start
          )
            .add(4, 'weeks')
            .format('YYYY-MM-DD');

          break;
        case gestationalAge >= 34 &&
          gestationalAge < 40 &&
          encounters.length === 0:
          nextVisitDate = moment().add(2, 'weeks').format('YYYY-MM-DD');

          break;
        case gestationalAge > 40:
          // disable the date of next visit

          break;
        default:
          break;
      }

      formik.setFieldValue('nextVisitDate', nextVisitDate);
      //  disable previous dates in the material date picker
    }
  };

  const handleDateChange = (date, field) => {
    if (field.name === 'edd') {
      const lmp = formik.values['lmp'];
      const edd = new Date(lmp);
      edd.setDate(edd.getDate() + 280);
      formik.setFieldValue(
        field.name,
        addDays(new Date(formik.values.lmp), 280)
      );
    } else {
      formik.setFieldValue(field.name, date);
    }
  };

  return (
    <>
      {sections.map((section, index) => (
        <div key={index}>
          <Typography
            variant='p'
            sx={{ fontSize: 'large', fontWeight: 'bold' }}
          >
            {section}
          </Typography>
          <Divider />
          <Grid container spacing={1} padding='1em'>
            {formData[section].map((field, idx) => {
              if (
                !field.relevant ||
                (field.relevant && field.relevant(formik.values))
              ) {
                switch (field.type) {
                  case 'text':
                    return (
                      <Grid item {...field.width} key={idx}>
                        <TextField
                          key={idx}
                          ref={inputRef}
                          fullWidth
                          label={field.label}
                          disabled={field.disabled}
                          name={field.name}
                          value={formik.values[field.name]}
                          onChange={e => {
                            handleInputChange(e, field, section);
                          }}
                          error={
                            formik.touched[field.name] &&
                            Boolean(formik.errors[field.name])
                          }
                          helperText={
                            formik.touched[field.name] &&
                            formik.errors[field.name]
                          }
                          size='small'
                        />
                      </Grid>
                    );
                  case 'date':
                    return (
                      <Grid item {...field.width} key={idx}>
                        {/* if the name is edd then we want to disable the date picker if the lmp is not set */}
                        {field.name === 'edd' ? (
                          !isMobile ? (
                            <DesktopDatePicker
                              label={field.label}
                              inputFormat='dd/MM/yyyy'
                              value={
                                (formik.values.edd = formik.values.lmp
                                  ? addDays(new Date(formik.values.lmp), 280)
                                  : null)
                              }
                              name={field.name}
                              onChange={date => {
                                handleDateChange(date, field, section);
                              }}
                              disabled={!formik.values.lmp}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  size='small'
                                  fullWidth
                                  error={
                                    formik.touched[field.name] &&
                                    Boolean(formik.errors[field.name])
                                  }
                                  helperText={
                                    formik.touched[field.name] &&
                                    formik.errors[field.name]
                                  }
                                  disablePast
                                  minDate={new Date()}
                                  // {...dateProps}
                                />
                              )}
                            />
                          ) : (
                            <MobileDatePicker
                              label={field.label}
                              disabled={!formik.values.lmp}
                              disablePast
                              minDate={new Date()}
                              inputFormat='dd/MM/yyyy'
                              value={
                                (formik.values.edd = formik.values.lmp
                                  ? addDays(new Date(formik.values.lmp), 280)
                                  : null)
                              }
                              name={field.name}
                              onChange={date => {
                                handleDateChange(date, field, section);
                              }}
                              renderInput={params => (
                                <TextField
                                  {...params}
                                  size='small'
                                  fullWidth
                                  error={
                                    formik.touched[field.name] &&
                                    Boolean(formik.errors[field.name])
                                  }
                                  helperText={
                                    formik.touched[field.name] &&
                                    formik.errors[field.name]
                                  }
                                  // {...dateProps}
                                />
                              )}
                            />
                          )
                        ) : !isMobile ? (
                          <DesktopDatePicker
                            label={field.label}
                            inputFormat='dd/MM/yyyy'
                            value={formik.values[field.name] || null}
                            name={field.name}
                            onChange={date => {
                              handleDateChange(date, field, section);
                            }}
                            renderInput={params => (
                              <TextField
                                {...params}
                                size='small'
                                fullWidth
                                error={
                                  formik.touched[field.name] &&
                                  Boolean(formik.errors[field.name])
                                }
                                helperText={
                                  formik.touched[field.name] &&
                                  formik.errors[field.name]
                                }
                              />
                            )}
                          />
                        ) : (
                          <MobileDatePicker
                            label={field.label}
                            inputFormat='dd/MM/yyyy'
                            value={formik.values[field.name] || null}
                            name={field.name}
                            onChange={date => {
                              if (field.name === 'edd') {
                                const lmp = formik.values['lmp'];
                                const edd = new Date(lmp);
                                edd.setDate(edd.getDate() + 280);
                                formik.setFieldValue(
                                  field.name,
                                  edd.toLocaleDateString('en-GB')
                                );
                              } else {
                                formik.setFieldValue(field.name, date);
                              }
                            }}
                            renderInput={params => (
                              <TextField
                                {...params}
                                size='small'
                                fullWidth
                                error={
                                  formik.touched[field.name] &&
                                  Boolean(formik.errors[field.name])
                                }
                                helperText={
                                  formik.touched[field.name] &&
                                  formik.errors[field.name]
                                }
                              />
                            )}
                          />
                        )}
                      </Grid>
                    );
                  case 'select':
                    return (
                      <Grid item {...field.width} key={idx}>
                        <FormControl
                          fullWidth
                          size='small'
                          error={
                            formik.touched[field.name] &&
                            Boolean(formik.errors[field.name])
                          }
                        >
                          <InputLabel id={field.name}>{field.label}</InputLabel>
                          <Select
                            labelId={field.name}
                            id={field.name}
                            name={field.name}
                            value={formik.values[field.name]}
                            onChange={e =>
                              handleChangeSelect(e, field, section, idx)
                            }
                            label={field.label}
                          >
                            {field.options.map((option, i) => (
                              <MenuItem key={i} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    );

                  case 'radio':
                    return (
                      <Grid item {...field.width} key={idx}>
                        <FormControl
                          component='fieldset'
                          error={
                            formik.touched[field.name] &&
                            Boolean(formik.errors[field.name])
                          }
                        >
                          <FormLabel component='legend'>
                            {field.label}
                          </FormLabel>
                          <RadioGroup
                            aria-label={field.name}
                            name={field.name}
                            value={formik.values[field.name]}
                            onChange={formik.handleChange}
                          >
                            <Grid container spacing={1}>
                              {field.options.map((option, i) => (
                                <Grid
                                  item
                                  key={i}
                                  xs={12}
                                  sm={12}
                                  md={6}
                                  lg={6}
                                >
                                  <FormControlLabel
                                    key={i}
                                    value={option.value}
                                    control={<Radio />}
                                    label={option.label}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    );

                  case 'textarea':
                    return (
                      <Grid item {...field.width} key={idx}>
                        <TextField
                          label={field.label}
                          name={field.name}
                          value={formik.values[field.name]}
                          onChange={formik.handleChange}
                          multiline
                          rows={4}
                          fullWidth
                          size='small'
                          error={
                            formik.touched[field.name] &&
                            Boolean(formik.errors[field.name])
                          }
                          helperText={
                            formik.touched[field.name] &&
                            formik.errors[field.name]
                          }
                        />
                      </Grid>
                    );

                  case 'checkbox':
                    return (
                      <Grid item {...field.width} key={idx}>
                        <FormControl
                          component='fieldset'
                          name={field.name}
                          error={
                            formik.touched[field.name] &&
                            Boolean(formik.errors[field.name])
                          }
                        >
                          <FormLabel component='legend'>
                            {field.label}
                          </FormLabel>
                          <FormGroup name={field.name}>
                            <Grid container spacing={1}>
                              {field.options.map((option, i) => (
                                <Grid
                                  item
                                  key={i}
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                >
                                  <FormControlLabel
                                    key={i}
                                    control={
                                      <Checkbox
                                        checked={formik.values[
                                          field.name
                                        ].includes(option.value)}
                                        onChange={e =>
                                          handleChangeChecked(e, field, option)
                                        }
                                        name={field.name}
                                        value={option.value}
                                      />
                                    }
                                    label={option.label}
                                  />
                                </Grid>
                              ))}
                            </Grid>
                          </FormGroup>
                        </FormControl>
                      </Grid>
                    );

                  case 'display':
                    return (
                      <Grid item {...field.width} key={idx}>
                        <Typography
                          variant='p'
                          sx={{ fontSize: 'medium', fontWeight: 'bold' }}
                        >
                          {`${field.label}: ${field.content}`}
                        </Typography>
                      </Grid>
                    );
                  default:
                    return null;
                }
              }
            })}
          </Grid>
        </div>
      ))}
    </>
  );
}
