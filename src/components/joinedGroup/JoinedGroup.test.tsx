import { render, RenderResult, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'modules';
import { setUser, setJoinedGroup } from 'modules/user';
import { GroupData, UserData } from 'types';
import JoinedGroup from './JoinedGroup';

const newUser: UserData = {
  displayName: 'test test',
  email: 'test@test.com',
  photoURL: 'photoURL',
  gender: null,
  age: 25,
  hostileRating: 0,
  levelOfExperience: 0,
  peerRating: 0,
  interests: ['test'],
  groups: [],
};

const newJoinedGroup: GroupData[] = [
  {
    id: 'test_group',
    name: 'Test Group',
    title: 'Test Group',
    description: 'Test Group',
    minAge: 0,
    maxAge: 100,
    gender: 'male',
    owner: 'test test',
    interest: 'test',
    peerRatingMin: 0,
    peerRatingMax: 5,
    hostileRatingMin: 0,
    hostileRatingMax: 5,
    levelOfExperienceMin: 0,
    levelOfExperienceMax: 10,
    members: [],
  },
];

const renderJoinedGroup = (): RenderResult =>
  render(
    <Provider store={store}>
      <JoinedGroup />
    </Provider>
  );

beforeEach(() => {
  store.dispatch(setUser(newUser));
});

describe('<JoinedGroup />', () => {
  test('When user log in, update user state', () => {
    const user = store.getState().user.user;
    expect(user).toBe(newUser);
  });

  test('When user does not have joined group, display guideline', () => {
    renderJoinedGroup();
    let guideline = screen.getAllByText(
      "You haven't joined a group yet. Please craete or join a group!"
    )[0];
    expect(guideline).toBeInTheDocument();
  });

  test('When user have a joined gorup, displya joined group list', () => {
    let addGroupToUser = Object.assign({}, newUser);
    addGroupToUser.groups = ['test_group'];
    store.dispatch(setUser(addGroupToUser));
    store.dispatch(setJoinedGroup(newJoinedGroup));
    renderJoinedGroup();
    let groupDesc = screen.getAllByText('Description: Test Group')[0];
    expect(groupDesc).toBeInTheDocument();
  });
});
