import { NumberHelper } from '../../globalization';

export class ErrorMessages {
  static get(code: string, label: string, parameters: Array<string> = []) {
    let config = {
          'required': `${label} é obrigatório(a)`,
          'maxlength': `${label} pode ter no máximo ${parameters[0]} caracteres`,
          'minlength': `${label} deve ter no mínimo ${parameters[0]} caracteres`,
          'max': `${label} deve possuir valor máximo de ${parameters[0]}`,
          'min': `${label} deve possuir valor mínimo de ${parameters[0]}`,
          'alreadyInUse': `${label} já está em uso`,
          'equalInvalid': `${label} não confere`,
          'invalid': `${label} é inválido(a)`,
          'autocompleteRequired': `${label} deve ser selecionado(a)`,
          'occupied': `${label} selecionado(a) está ocupado(a)`,
          'siloNotOccupied': `${label} selecionado(a) não está ocupado com nenhum lote`,
          'collaboratorHasStackholderValidator': `${label} não possui nenhum cliente relacionado`,
          'noPermissionForBatchCodeChange': `Usuário logado possui permissão apenas para entrada do tipo Normal`,
          'noPermissionForSacaria': `Armazém não permite armazenamento em sacaria`,
          'batchSwapBatchesNotDifferent': `O Lote de Destino precisa ser diferente do Lote de Origem`,
          'groupSum': `Soma do grupo deve ser entre ${parameters[0]} e ${parameters[1]}. Valor atual é de ${NumberHelper.toPTBR(NumberHelper.fromPTBR(parameters[2]))}`
      };
      let message = config[code];
      if (message) {
        return message;
      } else {
        return config['invalid'];
      }
  }
}
