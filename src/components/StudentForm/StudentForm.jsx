import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
// import axios from "axios";

const StudentForm = ({setStudentData}) => {
    const validationSchema = yup.object({
        firstname: yup
            .string('Enter your Firstname')
            .matches(/^[A-Za-z]+$/, 'Name can only contain letters')
            .required('Firstname is required'),
        lastname: yup
            .string('Enter your Lastname')
            .matches(/^[A-Za-z]+$/, 'Name can only contain letters')
            .required('Lastname is required'),
        email: yup
            .string()
            .email('Invalid email address')
            .min(8, 'Email must be at least 8 characters long')
            .max(50, 'Email cannot exceed 50 characters')
            .required('Email is required'),
        mobileno: yup
        .string()
        .matches(
          /^[0-9]{10}$/, // Regex for 10-digit mobile number
          'Mobile number must be exactly 10 digits'
        )
        .required('Mobile number is required'),
        dob: yup.date()
            .required('Date of Birth is required')
            .max(new Date(), 'Date of Birth cannot be in the future'),
        score: yup
        .string()
        .matches(/^[0-9]\d*$/, 'Only positive integers are allowed')
        .matches(
            /^(100|[1-9]?[0-9])$/,
            'The number must be between 0 and 100'
          )
        .min(0, 'we can score min of zero').
        max(100, 'we can score max of 100')
    })
    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            mobileno: '',
            email: '',
            dob: '',
            score: 0
        },
        validationSchema: validationSchema,
        onSubmit: (values, {resetForm}) => {
           let requestData = {
                "firstName": values.firstname,
                "lastName": values.lastname,
                "dateOfBirth": values.dob,
                "emailAddress": values.email,
                "cellphoneNumber": values.mobileno,
                "currentScore": values.score
            }
            console.log(requestData);
             axios.post(' http://localhost:8081/students/register',requestData)
            .then((res) => {console.log("Register Response:",res);
                alert(`Student Registered Successfully!\n\nName: ${res.data.studentFullName}`);
                setStudentData((prevData) => [...prevData, res.data]);
            })
            .catch((err) => {})
            resetForm()
        },
    });
    const handleReset = () => {
        formik.resetForm();
    }
    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
                <Grid size={6}>
                    <TextField
                        required
                        fullWidth
                        id="firstname"
                        name="firstname"
                        label="First Name"
                        value={formik.values.firstname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder='Enter the firstname'
                        error={formik.touched.firstname && Boolean(formik.errors.firstname)}
                        helperText={formik.touched.firstname && formik.errors.firstname}
                    />
                </Grid>
                <Grid size={6}>
                    <TextField
                        required
                        fullWidth
                        id="lastname"
                        name="lastname"
                        label="Last Name"
                        value={formik.values.lastname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastname && Boolean(formik.errors.lastname)}
                        helperText={formik.touched.lastname && formik.errors.lastname}
                    />
                </Grid>
                <Grid size={6}>
                    <TextField
                        required
                        fullWidth
                        id="mobileno"
                        name="mobileno"
                        label="Mobile Number"
                        value={formik.values.mobileno}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.mobileno && Boolean(formik.errors.mobileno)}
                        helperText={formik.touched.mobileno && formik.errors.mobileno}
                    />
                </Grid>
                <Grid size={6}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        type="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                </Grid>
                <Grid size={6}>
                    <TextField
                        required
                        fullWidth
                        id="dob"
                        name="dob"
                        label="Date of Birth"
                        type="dob"
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.dob && Boolean(formik.errors.dob)}
                        helperText={formik.touched.dob && formik.errors.dob}
                    />
                </Grid>
                <Grid size={6}>
                    <TextField
                        fullWidth
                        id="score"
                        name="score"
                        text='number'
                        label="Current Score"
                        value={formik.values.score}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.score && Boolean(formik.errors.score)}
                        helperText={formik.touched.score && formik.errors.score}
                    />
                </Grid>
                <Grid size={6}>
                    <Button color="none" disabled={formik.isValid ? false : true} variant="contained" fullWidth type="submit">
                        Save
                    </Button>
                </Grid>
                <Grid size={6}>
                    <Button color='none' variant="contained" fullWidth type="reset" onClick={handleReset}>
                        Reset
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default StudentForm;