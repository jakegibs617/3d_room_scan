describe('BathForge home', () => {
  it('shows the scan entry point', () => {
    cy.visit('/')
    cy.contains('BathForge')
    cy.contains('Start Bathroom Scan')
  })
})
