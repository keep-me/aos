describe('Animation Events', function() {
  context('Basic event triggering', function() {
    let aosInStub;
    let aosOutStub;

    beforeEach(() => {
      aosInStub = cy.stub();
      aosOutStub = cy.stub();
      
      cy.visit('/')
        .document()
        .then(document => {
          document.addEventListener('aos:in', aosInStub);
          document.addEventListener('aos:out', aosOutStub);
        });
    });

    it('Should trigger aos:in event for visible elements on init', function() {
      cy.initAOS();
      
      cy.wait(0, () => {
        expect(aosInStub).to.have.callCount(6);
        expect(aosOutStub).to.not.be.called;
      });
    });

    it('Should trigger aos:in event when elements become visible on scroll', function() {
      cy.initAOS();
      
      cy.wait(0, () => {
        expect(aosInStub).to.have.callCount(6);
      });
      
      cy.scrollTo(0, 400);
      
      cy.wait(0, () => {
        expect(aosInStub.callCount).to.be.greaterThan(6);
      });
    });

    it('Should trigger aos:out event when elements become invisible on scroll', function() {
      cy.initAOS();
      
      cy.wait(0, () => {
        expect(aosOutStub).to.not.be.called;
      });
      
      cy.scrollTo(0, 800);
      cy.wait(100);
      
      cy.scrollTo('top');
      
      cy.wait(0, () => {
        expect(aosOutStub).to.be.called;
      });
    });

    it('Should pass element detail in event', function() {
      let receivedElement;
      
      cy.visit('/')
        .document()
        .then(document => {
          document.addEventListener('aos:in', (e) => {
            receivedElement = e.detail;
          });
        })
        .initAOS();
      
      cy.wait(0, () => {
        expect(receivedElement).to.exist;
        expect(receivedElement.classList).to.include('aos-item');
        expect(receivedElement.hasAttribute('data-aos')).to.be.true;
      });
    });
  });

  context('Custom ID events', function() {
    let customInStub;
    let customOutStub;

    beforeEach(() => {
      customInStub = cy.stub();
      customOutStub = cy.stub();
      
      cy.visit('/')
        .document()
        .then(document => {
          document.addEventListener('aos:in:super-duper', customInStub);
          document.addEventListener('aos:out:super-duper', customOutStub);
        });
    });

    it('Should trigger custom ID event when element with data-aos-id is animated', function() {
      cy.initAOS();
      
      cy.wait(0, () => {
        expect(customInStub).to.not.be.called;
      });
      
      cy.scrollTo(0, 350);
      
      cy.wait(0, () => {
        expect(customInStub).to.be.calledOnce;
      });
    });

    it('Should trigger custom ID out event when element scrolls out', function() {
      cy.initAOS();
      
      cy.scrollTo(0, 350);
      cy.wait(100);
      
      cy.scrollTo('top');
      
      cy.wait(0, () => {
        expect(customOutStub).to.be.called;
      });
    });
  });

  context('Event behavior with once option', function() {
    let aosInStub;
    let aosOutStub;

    beforeEach(() => {
      aosInStub = cy.stub();
      aosOutStub = cy.stub();
      
      cy.visit('/')
        .document()
        .then(document => {
          document.addEventListener('aos:in', aosInStub);
          document.addEventListener('aos:out', aosOutStub);
        });
    });

    it('Should not trigger aos:out when once option is true', function() {
      cy.initAOS({
        once: true
      });
      
      cy.wait(0, () => {
        const initialCallCount = aosInStub.callCount;
        expect(aosOutStub).to.not.be.called;
      });
      
      cy.scrollTo(0, 800);
      cy.wait(100);
      
      cy.scrollTo('top');
      
      cy.wait(0, () => {
        expect(aosOutStub).to.not.be.called;
      });
    });

    it('Should trigger aos:in only once per element', function() {
      cy.initAOS({
        once: true
      });
      
      cy.wait(0, () => {
        const initialCallCount = aosInStub.callCount;
        
        cy.scrollTo(0, 800);
        cy.wait(100);
        
        cy.scrollTo('top');
        cy.wait(100);
        
        cy.scrollTo(0, 800);
        
        cy.wait(0, () => {
          expect(aosInStub.callCount).to.be.lessThan(initialCallCount * 3);
        });
      });
    });
  });

  context('Event behavior with mirror option', function() {
    let aosInStub;
    let aosOutStub;

    beforeEach(() => {
      aosInStub = cy.stub();
      aosOutStub = cy.stub();
      
      cy.visit('/')
        .document()
        .then(document => {
          document.addEventListener('aos:in', aosInStub);
          document.addEventListener('aos:out', aosOutStub);
        });
    });

    it('Should trigger multiple in/out events with mirror option', function() {
      cy.initAOS({
        mirror: true
      });
      
      cy.wait(0, () => {
        const initialInCount = aosInStub.callCount;
        
        cy.scrollTo(0, 800);
        cy.wait(100);
        
        cy.scrollTo('top');
        
        cy.wait(0, () => {
          expect(aosOutStub).to.be.called;
        });
      });
    });
  });

  context('Event dispatch details', function() {
    it('Should dispatch events as CustomEvent with proper detail', function() {
      let eventType, eventDetail;
      
      cy.visit('/')
        .document()
        .then(document => {
          document.addEventListener('aos:in', (e) => {
            eventType = e.constructor.name;
            eventDetail = e.detail;
          });
        })
        .initAOS();
      
      cy.wait(0, () => {
        expect(eventType).to.equal('CustomEvent');
        expect(eventDetail).to.exist;
        expect(eventDetail.nodeType).to.equal(1);
      });
    });

    it('Should not trigger duplicate events for already animated elements', function() {
      let callCounts = [];
      
      cy.visit('/')
        .document()
        .then(document => {
          document.addEventListener('aos:in', () => {
            callCounts.push(Date.now());
          });
        })
        .initAOS();
      
      cy.wait(0, () => {
        const firstCount = callCounts.length;
        
        cy.window().then(({ AOS }) => {
          AOS.refresh();
        });
        
        cy.wait(0, () => {
          expect(callCounts.length).to.equal(firstCount);
        });
      });
    });
  });
});
