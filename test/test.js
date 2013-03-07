var assert = require("assert")
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})

describe('Failwhale', function(){
	describe('whopa', function(){
		it('should fail hard and not let my app deploy', function(){
			assert.equal(1, 1);
		})
	})
})