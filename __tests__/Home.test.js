import React from 'React';

import renderer from 'react-test-renderer';

import Home from '../src/components/Home';

test('renders correctly', () => {
  const tree = renderer.create(<Home />).toJSON();
  expect(tree).toMatchSnapshot();
});
