import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const StylePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#F4F3FC',
      100: '#E5E3F9',
      200: '#CBC9F2',
      300: '#B1AEEB',
      400: '#9784E4',
      500: '#635FC7',
      600: '#584FAD',
      700: '#4B3F93',
      800: '#3C3079',
      900: '#2E235F',
      950: '#1F1545',
    },

    colorScheme: {
      light: {
        surface: {
          0: '#FFFFFF',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.500}',
          600: '#828fa3',
          700: '{slate.700}',
          800: '{slate.800}',
          900: '#20212c',
          950: '#20212c',
        },
      },
    },
  },
});

export default StylePreset;
