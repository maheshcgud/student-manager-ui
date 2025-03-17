import React, { useState } from 'react';
import { Field,Form, useFormik, Formik } from 'formik';
import * as yup from 'yup';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { InputLabel } from '@mui/material';
import { MenuItem } from '@mui/material';
import { FormControl } from '@mui/material';
import { Box } from '@mui/material';
import Select from '@mui/material/Select';
import {FormHelperText} from '@mui/material';
import axios from "axios";

const SearchForm = ({setStudentData}) => {
    // const [rows, setRows] = React.useState(props.studentData);
    // console.log('studentData', props.studentData);
    const validationSchema = yup.object({
        searchoption: yup.string()
            .required('Please select an option')
            .notOneOf([''], 'You must select a valid option'),
    })
    return (
        <Box style={{ padding: '16px', border: '1px solid #000' }}>
            <Formik
                initialValues={{
                    searchoption: '',
                    searchcriteria: ''
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { resetForm }) => {
                    const apiUrl = `http://localhost:8081/students/search?${values.searchoption}=${values.searchcriteria}`;

                    axios.get(apiUrl)
                    .then(res => {
                        console.log("API Response:", res.data);
                        setStudentData(res.data);
                        //alert("Search Results: " + JSON.stringify(res.data, null, 2));
                    })
                    .catch(err => {
                        console.error("API Error:", err);
                        alert("Error fetching data. Please check console.");
                    });

                    // Reset the form after submission
                    resetForm();
                }}
            >
                {({ values, handleChange, handleBlur, errors, touched, isValid, resetForm, handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label" required >Search By </InputLabel>
                                    <Field
                                        labelId="demo-simple-select-label"
                                        name="searchoption"
                                        as={Select}
                                        value={values.searchoption}
                                        label="Search By"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.searchcriteria && Boolean(errors.searchcriteria)}
                                        helperText={touched.searchcriteria && errors.searchcriteria}
                                    >
                                        <MenuItem value=''>Option</MenuItem>
                                        <MenuItem value='studentNumber'>Student Number</MenuItem>
                                        <MenuItem value='firstName'>First Name</MenuItem>
                                        <MenuItem value='lastName'>Last Name </MenuItem>
                                        <MenuItem value='emailAddress'>Email Address</MenuItem>
                                    </Field>
                                    {touched.searchoption && errors.searchoption && (
                                        <FormHelperText>{errors.searchoption}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="searchcriteria"
                                    name="searchcriteria"
                                    label="Search Criteria"
                                    value={values.searchcriteria}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.searchcriteria && Boolean(errors.searchcriteria)}
                                    helperText={touched.searchcriteria && errors.searchcriteria}
                                />
                            </Grid>
                            <Grid size={6}>
                                <Button color="none" disabled={isValid ? false : true} variant="contained" fullWidth type="submit">
                                    Search
                                </Button>
                            </Grid>
                            <Grid size={6}>
                                <Button color='none' variant="contained" fullWidth type="reset" onClick={resetForm}>
                                    Clear
                                </Button>
                            </Grid>

                        </Grid>

                    </form>
                )}
            </Formik>
        </Box>
    )
}

export default SearchForm;