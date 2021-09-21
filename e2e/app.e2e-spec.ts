import { AgrotopusWmsPage } from './app.po';

describe('agrotopus-wms App', function() {
  let page: AgrotopusWmsPage;

  beforeEach(() => {
    page = new AgrotopusWmsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
