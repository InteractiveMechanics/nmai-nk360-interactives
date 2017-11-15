QUnit.test('get Parameter by Name', function (assert) {
	assert.strictEqual(Init.getParameterByName('era', 'http://www.example.com/?era=2'), "2", 'integer');
	assert.strictEqual(Init.getParameterByName('era', 'http://www.examples.com/?era='), "",  'null');
});