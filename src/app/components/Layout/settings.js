import { themes } from '../Theme/initThemes';
import layout1Settings from './Layout1Settings';

export const LayoutSettings = {
  activeLayout: 'layout1', 
  activeTheme: 'blue', 
  perfectScrollbar: false,

  themes: themes,
  layout1Settings, 

  secondarySidebar: {
    show: true,
    open: false,
    theme: 'slateDark1'
  },
  
  footer: {
    show: true,
    fixed: false,
    theme: 'slateDark2' 
  }
};
