import * as moment from 'moment';
import { PurchaseProspect } from './purchase-prospect';
import { Collaborator } from '../collaborator/collaborator';
import { Carrier } from '../carrier/carrier';
import { Person } from './../person/person';
import { Drink } from './../drink/drink';
import { Strainer } from './../strainer/strainer';
import { CollaboratorService } from '../collaborator/collaborator.service';
import { ClassificationValue } from './../classification/classification-value';
import { Batch } from '../batch/batch';

const uuid = require('uuid/v4');

export const data: Array<PurchaseProspect> = [
  /* new PurchaseProspect(uuid(), '1',
     new Coollaborator("fc96e2fc-9a96-47bc-aab0-95ae9c369ba2",
       new Person('63c4d425-3553-4122-9d08-1d786c885680', "PHYSICAL", "ANTONIO FABIO SANTANA"),
       "COOPERATED", 1, -61467454800000, null, '', '3502', '3502'),
     new Carrier("1c180b6c-a952-4c54-877e-05bc62be166a",
       new Person("20524828-dab5-4f3b-8386-b0aa27c1f857", "JURIDICAL", "LIDER TRANSP. JMS LTDA")),
     +moment().subtract(1, 'days'), 'Aberto',
     [new PurchaseProspectBatch(uuid(),
       new Batch('758d82ea-636d-4e44-a067-35a3e104215d', "13140300190"),
       35,
       new ClassificationValue("44be885a-c3b6-42ad-9294-db7afd3e7106", 'CD2 - Café CD'),
       new Strainer("b77b4401-5dfe-4d69-bfd6-e9830f4a439a", 17, 'Peneira 17'),
       new Drink('ba7f997e-2adc-40a6-a0b1-f77c459e02b4', 'Mole', 4)),
     new PurchaseProspectBatch(uuid(),
       new Batch('2840d9df-8240-4e1f-9f89-abe18570d783', "12131600607"),
       35,
       new ClassificationValue("8459980a-5600-4abf-9071-aae5916a00ad", '1.0 - Café Fino'),
       new Strainer("feb75c0f-c760-4092-b74f-d8d4bacb975a", 14, 'Peneira 14'),
       new Drink('3089f330-b6fd-4808-9592-fdfcc6f47731', 'Dura', 1))
     ]),

   new PurchaseProspect(uuid(), '2',
     new Coollaborator("7567e149-db9d-422f-b88c-f6b00e1fe2a3",
       new Person("f5201282-d24e-4631-8262-0dfc7ddbec35", "PHYSICAL", "IRENE MARCELO V.DE SOUZA OUT"),
       "COOPERATED", 1, -61467454800000, null, '', '6137', '6137'),
     new Carrier("16da856f-4672-4b22-83c2-4a92e313d26c",
       new Person("ae734434-fd32-42b4-ae39-82ac1b287fa9", "JURIDICAL", "TRANSPORTADORA ROTACAFE LTDA")),
     +moment().subtract(2, 'days'), 'Aberto',
     [new PurchaseProspectBatch(uuid(),
       new Batch("e05277fe-6bdf-4b30-8f88-8bae69e90ab7", "17181600837"),
       35,
       new ClassificationValue("e4107e4c-cf6a-4231-9b50-219d04b9c5bc", "4.0 - Café Manchado"),
       new Strainer("a3f0308f-7659-44e6-8565-1c67263ed531", 13, 'Peneira 13'),
       new Drink("7dc3f441-10ad-4137-8509-5ccf17d08cbd", 'Riada', 2))
     ])*/
];
