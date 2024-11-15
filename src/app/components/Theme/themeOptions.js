import { red } from '@mui/material/colors';
import { components } from './components';
import "@fontsource/roboto"; 

const themeOptions = {
  typography: {
    fontFamily: '"Roboto", sans-serif', 
    fontSize: 14,
    body1: { fontSize: '14px' },
    h1: { fontFamily: '"Roboto", sans-serif' }, 
    h2: { fontFamily: '"Roboto", sans-serif' },
    h3: { fontFamily: '"Roboto", sans-serif' },
  },
  
  status: { danger: red[500] },
  components: { ...components },
};

export default themeOptions;
