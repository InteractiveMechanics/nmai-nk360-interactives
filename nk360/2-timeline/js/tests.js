QUnit.test('get Parameter by Name', function (assert) {
	assert.strictEqual(Init.getParameterByName('era', 'http://www.example.com/?era=1'), "1", 'Value as 1');
    assert.strictEqual(Init.getParameterByName('era', 'http://www.example.com/?era=2'), "2", 'Value as 2');
    assert.strictEqual(Init.getParameterByName('era', 'http://www.example.com/?era=3'), "3", 'Value as 3');
    assert.strictEqual(Init.getParameterByName('era', 'http://www.example.com/?era=4'), "4", 'Value as 4');
	assert.strictEqual(Init.getParameterByName('era', 'http://www.examples.com/?era='), "",  'null value');
    assert.strictEqual(Init.getParameterByName('era', 'http://www.examples.com/'), null,  'null value');
});
QUnit.test('get Timeline width', function (assert) {
	assert.equal(Detail.timelineWidth, 2143, 'Value as 2143');
});