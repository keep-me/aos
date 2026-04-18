describe('Core Methods', function() {
  context('init method', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should initialize AOS with default options', function() {
      cy.initAOS();
      
      cy.get('body').should('have.attr', 'data-aos-easing', 'ease');
      cy.get('body').should('have.attr', 'data-aos-duration', '400');
      cy.get('body').should('have.attr', 'data-aos-delay', '0');
      
      cy.get('.aos-init').should('have.length', 24);
    });

    it('Should initialize AOS with custom options', function() {
      cy.initAOS({
        offset: 100,
        delay: 50,
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
      
      cy.get('body').should('have.attr', 'data-aos-easing', 'ease-in-out');
      cy.get('body').should('have.attr', 'data-aos-duration', '600');
      cy.get('body').should('have.attr', 'data-aos-delay', '50');
    });

    it('Should not initialize AOS when disabled', function() {
      cy.initAOS({
        disable: true
      });
      
      cy.get('.aos-init').should('have.length', 0);
      cy.get('.aos-animate').should('have.length', 0);
    });

    it('Should initialize AOS and return elements array', function() {
      cy.window().then(({ AOS }) => {
        const result = AOS.init();
        expect(result).to.be.an('array');
        expect(result.length).to.be.greaterThan(0);
      });
    });

    it('Should add initClassName to all AOS elements', function() {
      cy.initAOS({
        initClassName: 'custom-init-class'
      });
      
      cy.get('.custom-init-class').should('have.length', 24);
    });

    it('Should use custom animatedClassName', function() {
      cy.initAOS({
        animatedClassName: 'custom-animated-class'
      });
      
      cy.get('.aos-animate').should('have.length', 0);
      cy.get('.custom-animated-class').should('have.length.greaterThan', 0);
    });

    it('Should respect custom startEvent', function() {
      cy.visit('/');
      cy.window().then(({ AOS, document }) => {
        AOS.init({
          startEvent: 'custom-init-event'
        });
        
        cy.get('.aos-init').should('have.length', 0);
        
        document.dispatchEvent(new Event('custom-init-event'));
      });
      
      cy.wait(100);
      cy.get('.aos-init').should('have.length', 24);
    });
  });

  context('refresh method', function() {
    beforeEach(() => {
      cy.visit('/');
      cy.initAOS();
    });

    it('Should have refresh method available', function() {
      cy.window().its('AOS.refresh').should('exist');
    });

    it('Should refresh element positions', function() {
      cy.window().then(({ AOS }) => {
        const initialElements = AOS.init();
        const initialPositions = initialElements.map(el => el.position);
        
        AOS.refresh();
        
        const refreshedElements = initialElements;
        const refreshedPositions = refreshedElements.map(el => el.position);
        
        expect(refreshedPositions).to.deep.equal(initialPositions);
      });
    });

    it('Should trigger animation updates after refresh', function() {
      cy.get('.aos-animate').should('have.length', 6);
      
      cy.scrollTo(0, 400);
      cy.get('.aos-animate').should('have.length.greaterThan', 6);
      
      cy.window().then(({ AOS }) => {
        AOS.refresh();
      });
      
      cy.get('.aos-animate').should('have.length.greaterThan', 0);
    });

    it('Should handle refresh after viewport change', function() {
      cy.get('.aos-animate').should('have.length', 6);
      
      cy.viewport('iphone-6');
      cy.wait(200);
      
      cy.window().then(({ AOS }) => {
        AOS.refresh();
      });
      
      cy.get('.aos-animate').should('exist');
    });
  });

  context('refreshHard method', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should have refreshHard method available', function() {
      cy.window().its('AOS.refreshHard').should('exist');
    });

    it('Should reinitialize AOS elements', function() {
      cy.initAOS();
      cy.get('.aos-init').should('have.length', 24);
      
      cy.get('.aos-item').first().then($el => {
        $el.remove();
      });
      
      cy.get('.aos-init').should('have.length', 24);
      
      cy.window().then(({ AOS }) => {
        AOS.refreshHard();
      });
      
      cy.get('.aos-init').should('have.length', 23);
    });

    it('Should handle dynamically added elements', function() {
      cy.visit('/async.html');
      cy.initAOS();
      
      cy.get('.aos-item').should('have.length', 0);
      
      cy.dispatchEvent('add-aos-item');
      cy.get('.aos-item').should('have.length', 1);
      
      cy.window().then(({ AOS }) => {
        AOS.refreshHard();
      });
      
      cy.get('.aos-init').should('have.length', 1);
      cy.get('.aos-animate').should('have.length', 1);
    });

    it('Should preserve configurations on refreshHard', function() {
      cy.initAOS({
        delay: 100,
        duration: 500,
        offset: 200
      });
      
      cy.get('body').should('have.attr', 'data-aos-delay', '100');
      cy.get('body').should('have.attr', 'data-aos-duration', '500');
      
      cy.window().then(({ AOS }) => {
        AOS.refreshHard();
      });
      
      cy.get('body').should('have.attr', 'data-aos-delay', '100');
      cy.get('body').should('have.attr', 'data-aos-duration', '500');
    });
  });

  context('Combined method tests', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should properly handle init -> refresh -> refreshHard sequence', function() {
      cy.initAOS();
      cy.get('.aos-init').should('have.length', 24);
      cy.get('.aos-animate').should('have.length', 6);
      
      cy.scrollTo(0, 500);
      cy.get('.aos-animate').should('have.length.greaterThan', 6);
      
      cy.window().then(({ AOS }) => {
        AOS.refresh();
      });
      
      cy.get('.aos-init').should('have.length', 24);
      
      cy.dispatchEvent('add-aos-item');
      
      cy.window().then(({ AOS }) => {
        AOS.refreshHard();
      });
      
      cy.get('.aos-init').should('exist');
    });

    it('Should not fail when calling methods in wrong order', function() {
      cy.window().then(({ AOS }) => {
        expect(() => AOS.refresh()).not.to.throw();
        expect(() => AOS.refreshHard()).not.to.throw();
      });
    });
  });
});
