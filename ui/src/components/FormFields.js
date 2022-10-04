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
} from '@mui/material';
import { useState } from 'react';

import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import counties from '../data/counties.json';
import countyToConstituency from '../data/constituencies.json';
import consituencyToWard from '../data/wards.json';
import { addDays } from 'date-fns';

export default function FormFields({ formik, formData, ...props }) {
  const isMobile = useMediaQuery('(max-width:600px)');

  const sections = Object.keys(formData);
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
              switch (field.type) {
                case 'text':
                  return (
                    <Grid item {...field.width} key={idx}>
                      <TextField
                        key={idx}
                        fullWidth
                        label={field.label}
                        disabled={field.disabled}
                        name={field.name}
                        value={formik.values[field.name]}
                        onChange={formik.handleChange}
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
                              formik.setFieldValue(field.name, date);
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
                              />
                            )}
                          />
                        ) : (
                          <MobileDatePicker
                            label={field.label}
                            disabled={!formik.values.lmp}
                            inputFormat='dd/MM/yyyy'
                            value={
                              (formik.values.edd = formik.values.lmp
                                ? addDays(new Date(formik.values.lmp), 280)
                                : null)
                            }
                            name={field.name}
                            onChange={date => {
                              formik.setFieldValue(field.name, date);
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
                        )
                      ) : !isMobile ? (
                        <DesktopDatePicker
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
                                addDays(new Date(formik.values.lmp), 280)
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
                          onChange={e => {
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
                              formData[section][idx + 1].options =
                                subCountyOptions;
                            }
                            if (field.name === 'subCounty') {
                              const constituencyCode =
                                countyToConstituency.find(
                                  item => item.name === e.target.value
                                ).code;
                              const wardOptions = consituencyToWard
                                .filter(
                                  item =>
                                    item.constituency_code == constituencyCode
                                )
                                ?.map(item => ({
                                  label: item.name,
                                  value: item.name,
                                }));
                              formData[section][idx + 1].options = wardOptions;
                            }
                            formik.setFieldValue(field.name, e.target.value);
                            console.log(formik.values);
                          }}
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
                        <FormLabel component='legend'>{field.label}</FormLabel>
                        <RadioGroup
                          aria-label={field.name}
                          name={field.name}
                          value={formik.values[field.name]}
                          onChange={formik.handleChange}
                        >
                          {field.options.map((option, i) => (
                            <FormControlLabel
                              key={i}
                              value={option.value}
                              control={<Radio />}
                              label={option.label}
                            />
                          ))}
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

                default:
                  return null;
              }
            })}
          </Grid>
        </div>
      ))}
    </>
  );
}
