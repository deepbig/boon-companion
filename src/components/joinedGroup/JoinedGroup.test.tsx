import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'modules';
import { setUser, setJoinedGroup } from 'modules/user';
import { GroupData, MemberData, UserData } from 'types';
import JoinedGroup from './JoinedGroup';
import { BrowserRouter } from 'react-router-dom';

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

const newJoinedGroup: GroupData = {
  id: 'test_group',
  name: 'Test Group',
  title: 'Test Group',
  description: 'This is description of test group',
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
};

const renderJoinedGroup = (): RenderResult =>
  render(
    <Provider store={store}>
      <BrowserRouter>
        <JoinedGroup />
      </BrowserRouter>
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
      "You haven't joined a group yet. Please create or join a group!"
    )[0];
    expect(guideline).toBeInTheDocument();
  });

  test('when user have a joined group but joined group is not updated yet, display circularProgress', () => {
    let addGroupToUser = Object.assign({}, newUser);
    addGroupToUser.groups = ['test_group'];
    store.dispatch(setUser(addGroupToUser));
    renderJoinedGroup();
    let groupLoading = screen.getByTestId('circular-progress');
    expect(groupLoading).toBeInTheDocument();
  });

  test('When user have a joined gorup, display joined group title', () => {
    let addGroupToUser = Object.assign({}, newUser);
    addGroupToUser.groups = ['test_group'];
    store.dispatch(setUser(addGroupToUser));
    store.dispatch(setJoinedGroup([newJoinedGroup]));
    renderJoinedGroup();
    let groupTitle = screen.getAllByText(`${newJoinedGroup.title}`)[0];
    expect(groupTitle).toBeInTheDocument();
  });

  test('When user have a joined gorup, display joined group description', () => {
    let addGroupToUser = Object.assign({}, newUser);
    addGroupToUser.groups = ['test_group'];
    store.dispatch(setUser(addGroupToUser));
    store.dispatch(setJoinedGroup([newJoinedGroup]));
    renderJoinedGroup();
    let groupDesc = screen.getAllByText(
      `Description: ${newJoinedGroup.description}`
    )[0];
    expect(groupDesc).toBeInTheDocument();
  });

  test('When user have a joined group, display joined group Interest', () => {
    let addGroupToUser = Object.assign({}, newUser);
    addGroupToUser.groups = ['test_group'];
    store.dispatch(setUser(addGroupToUser));
    store.dispatch(setJoinedGroup([newJoinedGroup]));
    renderJoinedGroup();
    let groupInterest = screen.getAllByText(
      `Interest: ${newJoinedGroup.interest}`
    )[0];
    expect(groupInterest).toBeInTheDocument();
  });

  test('When user have a joined group, display joined group members', () => {
    let addGroupToUser = Object.assign({}, newUser);
    addGroupToUser.groups = ['test_group'];
    let addMemberToGroup = Object.assign({}, newJoinedGroup);
    let members = [
      {
        displayName: 'test member',
        photoURL: 'test',
        uid: 'uid_abc',
      } as MemberData,
    ];
    addMemberToGroup.members = members;
    store.dispatch(setUser(addGroupToUser));
    store.dispatch(setJoinedGroup([addMemberToGroup]));
    renderJoinedGroup();
    let groupMembers = screen.getByTestId('group-members-avatar');
    expect(groupMembers).toBeInTheDocument();
  });

  test('When user clicks join group button, open Join Group Dialog Form', () => {
    renderJoinedGroup();
    const button = screen.getByText('Join a Group', { selector: 'button' });

    fireEvent.click(button);
    let groupCreateForm = screen.getAllByText('Search Groups By Criteria')[0];
    expect(groupCreateForm).toBeInTheDocument();
  });
});
