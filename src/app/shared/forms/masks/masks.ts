const createNumberMask: any = require('text-mask-addons/dist/createNumberMask').default;

export class Masks {
  static dateTimeMask = { mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/], guide: false };

  static dateMask = { mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/], guide: false };

  static postalCodeMask = { mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/], guide: false };

  static cpfMask = { mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/], guide: false };

  static cnpjMask = {
    mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/,
      /\d/, /\d/, '-', /\d/, /\d/], guide: false
  };

  static rgMask = { mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/], guide: false };

  static decimalMask = {
    mask: createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: false,
      thousandsSeparatorSymbol: '.',
      allowDecimal: true,
      decimalSymbol: ',',
      decimalLimit: 2,
      requireDecimal: false,
      allowNegative: false,
    }), guide: true
  };

  static decimalMask5Digits = {
    mask: createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: false,
      thousandsSeparatorSymbol: '.',
      allowDecimal: true,
      decimalSymbol: ',',
      decimalLimit: 5,
      requireDecimal: false,
      allowNegative: false,
    }), guide: true
  };

  static decimalMaskTransportationSackUnityValue = {
    mask: createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: false,
      thousandsSeparatorSymbol: '.',
      allowDecimal: true,
      decimalSymbol: ',',
      decimalLimit: 6,
      requireDecimal: false,
      allowNegative: false,
    }), guide: true
  };

  static integerMask = {
    mask: createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: false,
      allowDecimal: false,
      requireDecimal: false,
      allowNegative: false,
    }), guide: false
  };

  static unlimitedDecimalMask = {
    mask: createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: false,
      thousandsSeparatorSymbol: '.',
      allowDecimal: true,
      decimalSymbol: ',',
      decimalLimit: 99,
      requireDecimal: false,
      allowNegative: false
    }),
    guide: true
  };


  static vehiclePlateMask = {
    mask: [/[A-Z]/i, /[A-Z]/i, /[A-Z]/i, '-', /\d/, /\d/, /\d/, /\d/],
    guide: false
  };

  static phoneMask = {
    mask: function (userInput) {
      let numbers = userInput.match(/\d/g);
      let numberLength = 0;
      if (numbers) {
        numberLength = numbers.join('').length;
      }
      if (numberLength > 12) {
        return ['+', /[1-9]/, /[1-9]/, '(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      } else if (numberLength > 11) {
        return ['+', /[1-9]/, /[1-9]/, '(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      } else if (numberLength > 10) {
        return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      } else {
        return ['(', /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
      }
    },
    guide: false
  };
}
