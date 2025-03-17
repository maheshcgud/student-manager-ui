import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import FullFeaturedCrudGrid from "../StudentTable/StudentTable";
import StudentForm from '../StudentForm/StudentForm';
import SearchForm from '../SearchForm/SearchForm';
// import { useEffect } from 'react';
import axios from "axios";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [studentData, setStudentData] = React.useState([]);

    useEffect(() => {
      axios.get('http://localhost:8081/students')
      .then(res => {
        console.log("Full Response:", res);
        console.log("Response Data:", res.data);
        setStudentData(res.data);
      })
      .catch((err) => console.log('error', err))
    },[])
    
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  console.log("Response Data+:",studentData)
  return (
    
      <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Search" {...a11yProps(0)} />
          <Tab label="Create" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <h4>Quick Search</h4>
        <SearchForm setStudentData={setStudentData} />
        { studentData?.length != 0 && <FullFeaturedCrudGrid studentData={studentData}/>}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <h4>Create New Student</h4>
        <StudentForm setStudentData={setStudentData}/>
      </CustomTabPanel>
    </Box>
  );
}
