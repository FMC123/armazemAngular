export class DateTimeHelper {

  static fromDDMMYYYY(value: string, endOfDay?: boolean): number {
    if (!value) return null;
    if (endOfDay) {
      return +moment(value, 'DD/MM/YYYY').endOf('day').toDate();
    }
    return +moment(value, 'DD/MM/YYYY').startOf('day').toDate();
  }

  static toDDMMYYYY(value: number): string {
    if (!value) return null;
    return moment(value).format('DD/MM/YYYY');
  }

  static fromDDMMYYYYHHmm(value: string): number {
    if (!value) return null;
    return +moment(value, 'DD/MM/YYYY HH:mm').toDate();
  }

  static toDDMMYYYYHHmm(value: number): string {
    if (!value) return null;
    return moment(value).format('DD/MM/YYYY HH:mm');
  }

  static toHHmm(value: number): string {
    if (!value) return null;
    return moment(value).format('HH:mm');
  }

}
