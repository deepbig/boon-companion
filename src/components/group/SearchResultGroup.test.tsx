import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'modules';
import { setGroupList } from 'modules/group';
import { setUser } from 'modules/user';
import { GroupData, MemberData, UserData } from 'types';
import SearchResultGroup from './SearchResultGroup';

const newUser: UserData = {
  displayName: 'test test',
  email: 'test@test.com',
  photoURL: 'photoURL',
  gender: 'male',
  age: 25,
  hostileRating: 2,
  levelOfExperience: 3,
  peerRating: 4,
  interests: ['test'],
  groups: [],
};

const searchGroup: GroupData = {
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

const renderSearchResultGroup = (): RenderResult =>
  render(
    <Provider store={store}>
      <SearchResultGroup open={true} handleClose={() => {}} />
    </Provider>
  );

afterAll((done) => {
  done();
});

beforeEach(() => {
  store.dispatch(setUser(newUser));
  // store.dispatch(setGroupList([searchGroups]));
});

describe('<SearchResultGroup />', () => {
  test('when user click search, display search group result form', () => {
    renderSearchResultGroup();
    let searchResult = screen.getAllByText('Group Search Results')[0];
    expect(searchResult).toBeInTheDocument();
    // store.dispatch(setUser(null));
    // let groupLoading = screen.getByTestId('circular-progress-joinGroup');
    // expect(groupLoading).toBeInTheDocument();
  });

  test('when the search group result is empty, display guideline', () => {
    renderSearchResultGroup();
    let emptyResult = screen.getAllByText(
      'There are no available matching groups. Please modify your criteria to find a group.'
    )[0];
    expect(emptyResult).toBeInTheDocument();
  });

  test('when the search group result exist, display the list of available groups', () => {
    store.dispatch(setGroupList([searchGroup]));
    renderSearchResultGroup();
    let groupTitle = screen.getAllByText(`${searchGroup.title}`)[0];
    expect(groupTitle).toBeInTheDocument();
  });

  test('When user have a joined gorup, display joined group description', () => {
    store.dispatch(setGroupList([searchGroup]));
    renderSearchResultGroup();
    let groupDesc = screen.getAllByText(
      `Description: ${searchGroup.description}`
    )[0];
    expect(groupDesc).toBeInTheDocument();
  });

  test('When user have a joined group, display joined group Interest', () => {
    store.dispatch(setGroupList([searchGroup]));
    renderSearchResultGroup();
    let groupInterest = screen.getAllByText(
      `Interest: ${searchGroup.interest}`
    )[0];
    expect(groupInterest).toBeInTheDocument();
  });

  test('When user have a joined group, display joined group members', () => {
    let addMemberToGroup = Object.assign({}, searchGroup);
    let members = [
      {
        displayName: 'test member',
        photoURL: 'test',
        uid: 'uid_abc',
      } as MemberData,
    ];
    addMemberToGroup.members = members;
    store.dispatch(setGroupList([addMemberToGroup]));
    renderSearchResultGroup();
    let groupMembers = screen.getByTestId('group-members-avatar-search-result');
    expect(groupMembers).toBeInTheDocument();
  });
});
