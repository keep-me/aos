describe('Configuration Options', function() {
  context('delay option', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should set default delay attribute on body', function() {
      cy.initAOS();
      cy.get('body').should('have.attr', 'data-aos-delay', '0');
    });

    it('Should respect global delay setting and set attribute on body', function() {
      cy.initAOS({
        delay: 200
      });
      cy.get('body').should('have.attr', 'data-aos-delay', '200');
    });

    it('Should apply delay style to elements', function() {
      cy.initAOS({
        delay: 500
      });
      
      cy.get('.aos-init').first().then($el => {
        const styles = window.getComputedStyle($el[0]);
        expect(styles.transitionDelay).to.exist;
      });
    });
  });

  context('duration option', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should set default duration attribute on body', function() {
      cy.initAOS();
      cy.get('body').should('have.attr', 'data-aos-duration', '400');
    });

    it('Should respect global duration setting', function() {
      cy.initAOS({
        duration: 1000
      });
      cy.get('body').should('have.attr', 'data-aos-duration', '1000');
    });

    it('Should apply duration style to elements', function() {
      cy.initAOS({
        duration: 800
      });
      
      cy.get('.aos-init').first().then($el => {
        const styles = window.getComputedStyle($el[0]);
        expect(styles.transitionDuration).to.exist;
      });
    });
  });

  context('offset option', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should use default offset when not specified', function() {
      cy.initAOS({
        offset: 120
      });
      cy.get('.aos-animate').should('have.length', 6);
    });

    it('Should animate fewer elements with larger offset', function() {
      cy.initAOS({
        offset: 400
      });
      cy.get('.aos-animate').should('have.length', 3);
    });

    it('Should animate more elements with smaller offset', function() {
      cy.initAOS({
        offset: 0
      });
      cy.get('.aos-animate').should('have.length.greaterThan', 6);
    });
  });

  context('once option', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should keep elements animated when once is true', function() {
      cy.initAOS({
        once: true
      });
      
      cy.get('.aos-animate').should('have.length', 6);
      
      cy.scrollTo(0, 800);
      cy.wait(100);
      
      cy.scrollTo('top');
      
      cy.get('.aos-animate').should('have.length.greaterThan', 6);
    });

    it('Should not trigger out events when once is false', function() {
      cy.initAOS({
        once: false
      });
      
      cy.get('.aos-animate').should('have.length', 6);
      
      cy.scrollTo(0, 800);
      cy.wait(100);
      
      cy.scrollTo('top');
      
      cy.get('.aos-animate').should('have.length', 6);
    });
  });

  context('mirror option', function() {
    beforeEach(() => {
      cy.visit('/');
      cy.viewport(1280, 650);
    });

    it('Should animate elements in and out with mirror true', function() {
      cy.initAOS({
        mirror: true,
        offset: 50
      });
      
      cy.get('.aos-animate').should('have.length', 6);
      
      cy.scrollTo(0, 50);
      cy.get('.aos-animate').should('have.length', 9);
      
      cy.scrollTo(0, 300);
      cy.get('.aos-animate').should('have.length.lessThan', 9);
    });

    it('Should not animate out with mirror false', function() {
      cy.initAOS({
        mirror: false,
        offset: 50
      });
      
      cy.get('.aos-animate').should('have.length', 6);
      
      cy.scrollTo(0, 800);
      cy.wait(100);
      
      cy.scrollTo('top');
      
      cy.get('.aos-animate').should('have.length.greaterThan', 0);
    });
  });

  context('easing option', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should set default easing attribute on body', function() {
      cy.initAOS();
      cy.get('body').should('have.attr', 'data-aos-easing', 'ease');
    });

    it('Should respect custom easing', function() {
      cy.initAOS({
        easing: 'ease-in-out-cubic'
      });
      cy.get('body').should('have.attr', 'data-aos-easing', 'ease-in-out-cubic');
    });

    it('Should apply easing style', function() {
      cy.initAOS({
        easing: 'linear'
      });
      
      cy.get('body').should('have.attr', 'data-aos-easing', 'linear');
    });
  });

  context('anchorPlacement option', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should use default anchor placement', function() {
      cy.initAOS({
        anchorPlacement: 'top-bottom'
      });
      cy.get('.aos-animate').should('have.length', 6);
    });

    it('Should respect different anchor placements', function() {
      cy.initAOS({
        anchorPlacement: 'center-bottom'
      });
      cy.get('.aos-animate').should('exist');
    });
  });

  context('initClassName option', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should use default init class name', function() {
      cy.initAOS();
      cy.get('.aos-init').should('have.length', 24);
    });

    it('Should use custom init class name', function() {
      cy.initAOS({
        initClassName: 'my-custom-init'
      });
      cy.get('.my-custom-init').should('have.length', 24);
      cy.get('.aos-init').should('have.length', 0);
    });
  });

  context('animatedClassName option', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should use default animated class name', function() {
      cy.initAOS();
      cy.get('.aos-animate').should('have.length', 6);
    });

    it('Should use custom animated class name', function() {
      cy.initAOS({
        animatedClassName: 'my-custom-animated'
      });
      cy.get('.my-custom-animated').should('exist');
      cy.get('.aos-animate').should('have.length', 0);
    });
  });

  context('useClassNames option', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should not use class names when enabled', function() {
      cy.initAOS({
        useClassNames: true
      });
      cy.get('.fade-up').should('not.exist');
    });
  });

  context('disable option', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should disable AOS when disable is true', function() {
      cy.initAOS({
        disable: true
      });
      cy.get('.aos-init').should('have.length', 0);
      cy.get('.aos-animate').should('have.length', 0);
    });

    it('Should not disable when disable is false', function() {
      cy.initAOS({
        disable: false
      });
      cy.get('.aos-init').should('have.length', 24);
    });
  });

  context('disableMutationObserver option', function() {
    beforeEach(() => {
      cy.visit('/async.html');
    });

    it('Should disable mutation observer when option is true', function() {
      cy.initAOS({
        disableMutationObserver: true
      });
      
      cy.get('.aos-item').should('have.length', 0);
      
      cy.dispatchEvent('add-aos-item');
      
      cy.get('.aos-item').should('have.length', 1);
      
      cy.get('.aos-init').should('have.length', 0);
    });

    it('Should enable mutation observer when option is false', function() {
      cy.initAOS({
        disableMutationObserver: false
      });
      
      cy.get('.aos-item').should('have.length', 0);
      
      cy.dispatchEvent('add-aos-item');
      
      cy.get('.aos-item').should('have.length', 1);
      
      cy.get('.aos-init').should('have.length', 1);
    });
  });

  context('Combined configuration', function() {
    beforeEach(() => {
      cy.visit('/');
    });

    it('Should apply multiple configuration options together', function() {
      cy.initAOS({
        offset: 100,
        delay: 100,
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        initClassName: 'test-init',
        animatedClassName: 'test-animated'
      });
      
      cy.get('body').should('have.attr', 'data-aos-delay', '100');
      cy.get('body').should('have.attr', 'data-aos-duration', '800');
      cy.get('body').should('have.attr', 'data-aos-easing', 'ease-in-out');
      
      cy.get('.test-init').should('have.length', 24);
      cy.get('.test-animated').should('exist');
    });
  });
});
