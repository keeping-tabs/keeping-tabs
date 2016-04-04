
var foo = 'bar';
var tea = {
  flavors:['mocha', 'chai', 'coffee']
};

describe('Example Tests', function () {
  // it('should equal 2 in just plain mocha', function () {
  //   assert.equal(2, 1 + 1);
  // });
  it('An example of using chai should', function () {
    chai.should();
    foo.should.be.a('string');
    foo.should.equal('bar');
    foo.should.have.length(3);
    tea.should.have.property('flavors')
      .with.length(3);
  });
  it('An example of using chai expect', function () {
    var expect = chai.expect;

    expect(foo).to.be.a('string');
    expect(foo).to.equal('bar');
    expect(foo).to.have.length(3);
    expect(tea).to.have.property('flavors')
      .with.length(3);
  });
  it('An example of using chai assert', function () {
    var assert = chai.assert;

    assert.typeOf(foo, 'string');
    assert.equal(foo, 'bar');
    assert.lengthOf(foo, 3)
    assert.property(tea, 'flavors');
    assert.lengthOf(tea.flavors, 3);
  });
});




var assert = chai.assert;
chai.should();
var expect = chai.expect;

describe('Linked List tests', function () {
  it('should be a constructor function', function () {
    assert.typeOf(Link, 'function');
  });
  it('new Link() should be an instance of the Link constructor', function () {
    ((new Link()) instanceof Link).should.equal(true);
  });
  it('should have a data property equal to the data passed in on instantiation', function () {
    (new Link('myData')).should.have.property('data').equal('myData');
  });
  // it(,function () {});
  // it(,function () {});
  // it(,function () {});
  // it(,function () {});
  // it(,function () {});
});




// console.log(
//   'Linked List tests',
//   '\n',

//   typeof Link === 'function',
//   ' : The Link constructor should be a function',
//   '\n',

//   (new Link()) instanceof Link,
//   ' : A link should be an instance of the Link constructor',
//   '\n',

//   (new Link('myData')).data === 'myData',
//   ' : A link should have a data property equal to the data passed in on instantiation',
//   '\n',

//   typeof LinkedList === 'function',
//   ' : The LinkedList constructor should be a function',
//   '\n',

//   (new LinkedList()) instanceof LinkedList,
//   ' : A linked-list should be an instance of the LinkedList constructor',
//   '\n',

//   (function () {
//     var list = new LinkedList();
//     list.push(new Link(true));
//     list.push(new Link(false));
//     return list.head.data === true && list.tail.data === false;
//   })(),
//   ' : the push method shoud add a link to the end of the linked-list',
//   '\n',

//   (function () {
//     var list = new LinkedList();
//     list.unshift(new Link(true));
//     list.unshift(new Link(false));
//     return list.head.data === false && list.tail.data === true;   
//   })(),
//   ' : the unshift method shoud add a link to the front of the linked-list',
//   '\n',

//   (function () {
//     var list = new LinkedList();
//     list.push(new Link(true));list.push(new Link(false));
//     return list.pop().data === false && list.pop().data === true && list.pop() === null;
//   })(),
//   ' : the pop method should remove a link from the end of the linked-list. A pop on an empty list should return null.',
//   '\n',

//   (function () {
//     var list = new LinkedList();
//     list.push(new Link(true));list.push(new Link(false));
//     return list.shift().data === true && list.shift().data === false && list.shift() === null;
//   })(),
//   ' : the shift method should remove a link from the front of the linked-list. A shift on an empty list should return null.',
//   '\n',

//   (function () {
//     var list = new LinkedList();
//     var errorOccured = [false, false];
//     try {
//       list.push('not a link');
//     } catch (error) {
//       errorOccured[0] = true
//     }
//     try {
//       list.unshift('not a link');
//     } catch (error) {
//       errorOccured[1] = true
//     } 
//     return errorOccured.every(function (val) {return val === true;});
//   })(),
//   ' : the linked-list should throw an error when pushing or unshifting something that is not a link',
//   '\n',


//   'end'
// );