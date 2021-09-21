export class TypeCoffee {

      static NORMAL = TypeCoffee.fromData('LT');
      static PERSONALIZADO = TypeCoffee.fromData('PE');
      static PREPARO = TypeCoffee.fromData('OR');
      static NENHUM = TypeCoffee.fromData('Nenhum');

      static list(): Array<TypeCoffee> {
        return [
          this.NORMAL,
          this.PERSONALIZADO,
          this.PREPARO,
          this.NENHUM
        ];
      }

      static fromListData(listData: Array<string>): Array<TypeCoffee> {
        return listData.map((data) => {
          return TypeCoffee.fromData(data);
        });
      }

      static fromData(data: string): TypeCoffee {
        if (!data) return new this();
        let status = new this(data);
        return status;
      }

      static fromDataObject(data: TypeCoffee): TypeCoffee {
        if (!data) return new this();
        let typeCoffee = new this();
        return typeCoffee;
      }

      constructor(public code?: string) {}

      get name(){
        switch (this.code) {
          case 'LT':
            return 'LT - Normal';
          case 'PE':
            return 'PE - Personalizado';
          case 'OR':
            return 'OR - Preparo';
            case 'Nenhum':
            return 'Selecione um tipo de café';
          default:
            return null;
        }
      }
    }
