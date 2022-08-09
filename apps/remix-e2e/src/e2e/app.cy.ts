import { getGreeting } from '../support/app.po';

describe('remix-bff', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // cy.login('my-email@something.com', 'myPassword');

    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Welcome to Remix');
  });
});
