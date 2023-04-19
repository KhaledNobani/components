import { withTheme } from './decorator.js';
import { updateTheme } from './theme.js';

export const decorators = [withTheme];
export const globalTypes = {
  mode: {
    default: 'light',
    toolbar: {
      icon: 'mirror',
        // Array of plain string values or MenuItem shape (see below)
        items: [
          {
            title:'Light mode',
            left: '🌞',
            value:'light'
          }, 
          {
            title:'Dark mode',
            left: '🌛',
            value:'dark'
          }
        ],
        // Change title based on selected value
        dynamicTitle: true
    }
  }
};
export const globals = {
  themes: [
    {
      id: 'bingel',
      name: 'Bingel',
      color: '#0074df',
      fonts: ['https://use.typekit.net/xrr8gdw.css'],
      setup: async () => {
        const { setup } = await import('@sanomalearning/slds-bingel');

        setup();
      }
    },
    {
      id: 'bingel-dc',
      name: 'Bingel DC',
      color: '#0074df',
      fonts: ['https://use.typekit.net/ghy4rhf.css'],
      setup: async () => {
        const { setup } = await import('@sanomalearning/slds-bingel-dc');

        setup();
      }
    },
    {
      id: 'bingel-int',
      name: 'Bingel INT',
      color: '#0074df',
      fonts: ['https://use.typekit.net/xrr8gdw.css'],
      setup: async () => {
        const { setup } = await import('@sanomalearning/slds-bingel-int');

        setup();
      }
    },
    {
      id: 'clickedu',
      name: 'Clickedu',
      color: '#0074df',
      fonts: ['https://use.typekit.net/xrr8gdw.css'],
      setup: async () => {
        const { setup } = await import('@sanomalearning/slds-clickedu');

        setup();
      }
    },
    {
      id: 'itslearning',
      name: 'itslearning',
      color: '#0074df',
      fonts: ['https://use.typekit.net/ucw7xel.css'],
      setup: async () => {
        const { setup } = await import('@sanomalearning/slds-itslearning');

        setup();
      }
    },
    {
      id: 'kampus',
      name: 'Kampus',
      color: '#0074df',
      fonts: ['https://use.typekit.net/xrr8gdw.css'],
      setup: async () => {
        const { setup } = await import('@sanomalearning/slds-kampus');

        setup();
      }
    },
    {
      id: 'magister',
      name: 'Magister',
      color: '#1f97f9',
      fonts: [
        'https://use.typekit.net/zkq0zzv.css',
        '/themes/sanoma-learning/fonts.css'
      ],
      setup: async () => {
        const { setup } = await import('@sanomalearning/slds-magister');

        setup();
      }
    },
    {
      id: 'max',
      name: 'MAX Online',
      color: '#253646',
      fonts: ['https://use.typekit.net/doq6twb.css'],
      setup: async () => {
        const { setup } = await import('@sanomalearning/slds-max');

        setup();
      }
    },
    {
      id: 'neon',
      name: 'NEON',
      color: '#1E2922',
      fonts: ['https://use.typekit.net/kes1hoh.css'],
      setup: async () => {
        const { setup } = await import('@sanomalearning/slds-neon');

        setup();
      }
    },
    {
      id: 'sanoma-learning',
      name: 'Sanoma Learning',
      color: '#56CC8A',
      fonts: [
        'https://use.typekit.net/kes1hoh.css',
        '/themes/sanoma-learning/fonts.css'
      ],
      setup: async () => {
        const { setup } = await import('@sanomalearning/slds-sanoma-learning');

        setup();
      }
    },
  ],
  selectedTheme: 'sanoma-learning'
};

updateTheme(globals.themes.find(t => t.id === globals.selectedTheme));


