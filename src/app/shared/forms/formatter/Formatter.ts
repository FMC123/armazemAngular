export class Formatter {
  static documentFormat(document: string): string {
    if (!document) {
      return '';
    }
    document = document.replace(/[^\d]+/g, '');
    if (document.length === 14) {
      return document.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        '$1.$2.$3/$4-$5'
      );
    } else if (document.length === 11) {
      return document.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return document;
  }

  static rgFormat(rg: string): string {
    rg = rg.replace(/[^\d]+/g, '');
    if (rg) {
      return rg.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
    }
    return '';
  }

  static zipCodeFormat(zipCode: string): string {
    zipCode = zipCode.replace(/[^\d]+/g, '');
    if (zipCode && zipCode.length === 8) {
      return zipCode.replace(/^(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
    }
    return '';
  }

  static phoneFormat(data: string): string {
    if (data.length > 12){
      return data.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1($2) $3-$4');
    } else if (data.length > 11){
      return data.replace(/^(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1($2) $3-$4');
    }else if (data.length > 10) {
      return data.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
      return data.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
  }
}
