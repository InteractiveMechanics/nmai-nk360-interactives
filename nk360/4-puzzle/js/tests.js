QUnit.test('Puzzle contains', function (assert) {
    assert.ok(Puzzle.contains.call([1,2,3], 2), '2 is in the array');
    assert.ok(Puzzle.contains.call([1,2,3], 3), '3 is in the array');
    assert.ok(Puzzle.contains.call([1,2,3], 1), '1 is in the array');
    assert.ok(!Puzzle.contains.call([1,3,4], 2), 'Value is not in the array');
    assert.ok(!Puzzle.contains.call([1, 2, 3], "apple"), "Value is not in the array");
    assert.ok(!Puzzle.contains.call([1, 2, 3], 4), "Value is not in the array");
});

