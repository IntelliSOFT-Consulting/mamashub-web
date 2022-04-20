import React from 'react';
import { useMediaQuery } from '@mui/material';
import HeaderDrawer from './HeaderDrawer';
import Header from './Header';


const Layout =({children}) =>{

    let isMobile = useMediaQuery('(max-width:600px)');

    return(
        <>
        {isMobile ? <Header children={children}/> : <HeaderDrawer children={children}/>}
        </>
    )
}

export default Layout;