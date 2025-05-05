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
  },
});

export default StylePreset;
