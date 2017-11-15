QUnit.test('contains', function (assert) {
    assert.ok(Puzzle.contains.call([1,2,3], 2), '2 is in the array');
    assert.ok(!Puzzle.contains.call([1,3,4], 2), '2 is not in the array');
    assert.ok(!Puzzle.contains.call([1, 2, 3], "apple"), "apple is not in the array");
});

